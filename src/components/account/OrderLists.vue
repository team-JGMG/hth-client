<!-- OrderLists.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import { formatDateTime } from '@/utils/format.js'
import { getOrderHistory, cancelOrder } from '@/api/trade'

import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

function toIso(dateStr) {
  return typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr
}
function parseDate(dateStr) {
  return new Date(toIso(dateStr))
}
function n(v, d = 0) {
  const num = Number(v)
  return Number.isFinite(num) ? num : d
}
function nfmt(v) {
  return n(v).toLocaleString()
}
function formatToMMDD(dateStr) {
  const [datePart] = formatDateTime(toIso(dateStr)).split(' ')
  const [, mm, dd] = (datePart || '').split('.')
  return `${String(mm || '00').padStart(2, '0')}.${String(dd || '00').padStart(2, '0')}`
}
function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(toIso(dateStr)).split(' ')
  return timePart || ''
}
const prepareOrders = (arr) => arr.map((o) => ({ ...o, _ui: { dragX: 0, touchStartX: 0 } }))

/* 🔧 테스트 유저: 데이터 있는 ID */
// -------------------------------------------

// -------------------------------------------
const orders = ref([])
const isFirstLoad = ref(true)
const loadError = ref(null)
const isSubmitting = ref(false)

const PAGE_SIZE = 5
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const bottomRef = ref(null)
let observer = null
const isLoading = ref(false)

const page = ref(0)
const hasNext = ref(true)

const bufferedMode = ref(false) // 서버가 배열만 줄 때 true
const bufferAll = ref([]) // 전체 배열
const bufferCursor = ref(0) // 다음 슬라이스 시작 인덱스

function mapApiOrderToUi(o) {
  const pricePer = n(o?.orderPricePerShare ?? o?.pricePerShare ?? o?.price_per_share)
  const shareCnt = n(o?.orderShareCount ?? o?.shareCount ?? o?.shares)
  const created =
    o?.createdAt ??
    o?.created_at ??
    o?.createdDate ??
    o?.orderDate ??
    o?.timestamp ??
    new Date().toISOString()

  return {
    id: o?.orderId ?? o?.id ?? o?.historyId ?? o?.order_id ?? o?.history_id,
    itemName: o?.propertyTitle ?? o?.title ?? o?.name ?? '',
    shares: shareCnt,
    totalPrice: pricePer * shareCnt,
    status:
      o?.orderType === 'BUY'
        ? '매수'
        : o?.orderType === 'SELL'
          ? '매도'
          : (o?.orderType ?? o?.type ?? ''),
    createdAt: toIso(created),
    pendingShares: n(o?.remainingShareCount ?? o?.pendingShares ?? 0),
    _raw: o,
  }
}

/* ---------- 언랩 ---------- */
function findFirstArray(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 3) return null
  if (Array.isArray(obj)) return obj
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v
  }
  for (const v of Object.values(obj)) {
    const found = findFirstArray(v, depth + 1)
    if (found) return found
  }
  return null
}
function unwrapServerPaging(res) {
  const d1 = res?.data
  const d2 = d1?.data ?? d1
  if (Array.isArray(d2?.content)) return { content: d2.content, meta: d2, mode: 'content' }
  if (Array.isArray(d2?.items)) return { content: d2.items, meta: d2, mode: 'items' }
  return null
}
function unwrapArray(res) {
  const d1 = res?.data
  const arr = findFirstArray(d1)
  return Array.isArray(arr) ? arr : null
}

// 🔎 취소 상태 판별 (영문/한글 모두)
function isCancelledStatus(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return false
  const u = s.toUpperCase()
  return u.includes('CANCEL') || u === 'CANCELED' || u === 'CANCELLED' || s === '취소'
}

// ✅ 취소 건 제외하고 매핑
function mapAndFilter(list) {
  return list
    .map(mapApiOrderToUi)
    .filter((o) => !isCancelledStatus(o?._raw?.orderStatus ?? o?._raw?.status ?? o?.status))
}

/** ---- 서버/배열 모두 "취소 제외 후 최소 PAGE_SIZE개" 채워 넣기 ---- **/

async function fetchOrdersPage() {
  if (isLoading.value) return

  // 클라 청크 모드면 청크 쪽으로 위임
  if (bufferedMode.value) {
    return appendNextChunk(PAGE_SIZE) // 항상 PAGE_SIZE만큼 채우도록 요청
  }

  if (!hasNext.value) return
  isLoading.value = true
  try {
    let added = 0
    let iter = 0

    while (added < PAGE_SIZE && hasNext.value && iter < 10) {
      const res = await getOrderHistory(page.value, PAGE_SIZE)
      console.log('[orders fetch]', { page: page.value, raw: res?.data })
      await delay(20)

      const paged = unwrapServerPaging(res)

      if (paged) {
        // ✅ 서버 페이징: 취소 제외 후 누적
        const mapped = mapAndFilter(paged.content || [])
        console.log('[orders page append]', {
          page: page.value,
          got: (paged.content || []).length,
          mapped: mapped.length,
          meta: {
            hasNext: paged.meta?.hasNext,
            last: paged.meta?.last,
            totalPages: paged.meta?.totalPages,
            number: paged.meta?.number,
          },
        })
        orders.value.push(...prepareOrders(mapped))
        added += mapped.length

        const nextFlag =
          typeof paged.meta?.hasNext === 'boolean' ? paged.meta.hasNext : paged.meta?.last === false
        hasNext.value = !!nextFlag
        if (nextFlag) page.value += 1
      } else {
        // ✅ 배열 모드: 여기서 즉시( isLoading=true 여도 ) 5개가 모일 때까지 채워 넣기
        const arr = unwrapArray(res) || []
        console.log('[orders array mode]', { total: arr.length })

        bufferedMode.value = true
        bufferAll.value = arr
        bufferCursor.value = 0

        // 최초 호출이면 "항상 최소 5개"를 보장
        const target = Math.max(PAGE_SIZE - added, PAGE_SIZE)
        while (added < target && bufferCursor.value < bufferAll.value.length) {
          const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
          bufferCursor.value += slice.length

          const mapped = mapAndFilter(slice) // ⬅️ 취소 제외 여기서
          console.log('[orders buffer immediate]', {
            from: bufferCursor.value - slice.length,
            size: slice.length,
            mapped: mapped.length,
          })
          orders.value.push(...prepareOrders(mapped))
          added += mapped.length
        }

        // 다음 호출(스크롤)부터는 appendNextChunk가 계속 채움
        break
      }

      iter += 1
    }
  } catch (err) {
    console.error('❌ 거래 내역 불러오기 실패:', err)
    loadError.value = err
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

/** ---- 버퍼(배열만 내려올 때)에서도 "취소 제외 후 최소 N개" 채우기 ---- **/
async function appendNextChunk(minToFill = PAGE_SIZE) {
  if (isLoading.value) return
  const total = bufferAll.value.length
  if (bufferCursor.value >= total) return

  isLoading.value = true
  try {
    let added = 0
    let iter = 0

    while (added < minToFill && bufferCursor.value < total && iter < 50) {
      await delay(20)
      // 원본은 PAGE_SIZE 단위로 자르되, 필터링 후 부족하면 다음 슬라이스 계속 가져감
      const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
      bufferCursor.value += slice.length

      const mapped = mapAndFilter(slice) // ⬅️ 여기서 취소 제외
      console.log('[orders buffer append]', {
        from: bufferCursor.value - slice.length,
        size: slice.length,
        mapped: mapped.length,
      })
      orders.value.push(...prepareOrders(mapped))
      added += mapped.length

      iter += 1
    }
  } catch (e) {
    console.error('❌ 청크 추가 실패:', e)
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

/** ---- 트리거 완화 (sentinel이 조금만 보여도 로드) ---- **/
function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || isLoading.value) return
      if (bufferedMode.value) {
        appendNextChunk()
      } else if (hasNext.value) {
        fetchOrdersPage()
      }
    },
    {
      threshold: 0,
      rootMargin: '0px 0px 200px 0px',
    },
  )
  if (bottomRef.value) observer.observe(bottomRef.value)
}

onMounted(async () => {
  await fetchOrdersPage()
  await nextTick()
  setupObserver()
})
onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt)),
)

const isModalOpen = ref(false)
const selectedOrder = ref(null)

function openDeleteModal(order) {
  if (!order.pendingShares || order.pendingShares === 0) {
    toast.warn('체결된 주문은 취소할 수 없습니다.')
    return
  }
  selectedOrder.value = order
  isModalOpen.value = true
}
function closeModal() {
  if (selectedOrder.value) {
    selectedOrder.value._ui.dragX = 0
  }
  isModalOpen.value = false
  selectedOrder.value = null
}

async function confirmDelete() {
  if (!selectedOrder.value || isSubmitting.value) return
  const targetId = selectedOrder.value.id
  if (!targetId) return
  toast.error({
    title: '주문 ID 오류',
    body: '주문 ID를 찾을 수 없습니다.',
  })
  isSubmitting.value = true
  try {
    await cancelOrder(targetId)
    orders.value = orders.value.filter((o) => o.id !== targetId)
    // 삭제 성공 시에도 동일하게 원복 + 닫기
    closeModal()
  } catch (e) {
    toast.error({
      title: '주문 취소 실패',
      body: e?.response?.data?.message || e?.message || '주문 취소에 실패했습니다.',
    })
  } finally {
    isSubmitting.value = false
  }
}

/* 터치 슬라이드 삭제 UI */
function getYear(dateStr) {
  return parseDate(dateStr).getFullYear()
}
function isNewYear(index) {
  if (index === 0) return true
  const currentYear = getYear(sortedOrders.value[index].createdAt)
  const prevYear = getYear(sortedOrders.value[index - 1].createdAt)
  return currentYear !== prevYear
}
function handleTouchStart(e, order) {
  orders.value.forEach((o) => {
    if (o !== order) o._ui.dragX = 0
  })
  order._ui.touchStartX = e.touches[0].clientX
}
function handleTouchMove(e, order) {
  const deltaX = e.touches[0].clientX - order._ui.touchStartX
  if (deltaX < 0) order._ui.dragX = Math.max(deltaX, -60)
}
function handleTouchEnd(order) {
  if (order._ui.dragX <= -60) {
    order._ui.dragX = -60
    if (!isModalOpen.value) {
      selectedOrder.value = order
      isModalOpen.value = true
    }
  } else {
    order._ui.dragX = 0
  }
}
</script>

<template>
  <div class="py-3"></div>
  <div class="p-4 min-h-[600px] space-y-0">
    <div v-if="loadError && isFirstLoad" class="py-10 text-center text-red-500">
      거래 내역을 불러오지 못했습니다.
    </div>

    <div v-else-if="!sortedOrders.length && !isLoading" class="py-10 text-center text-gray-400">
      주문 내역이 없습니다.
    </div>

    <template v-else>
      <template
        v-for="(order, index) in sortedOrders"
        :key="order.id ?? `${order.createdAt}-${order.itemName}-${index}`"
      >
        <BaseTypography v-if="isNewYear(index)" class="text-sm text-gray-500">
          {{ getYear(order.createdAt) }}년
        </BaseTypography>

        <div class="relative rounded-md overflow-hidden">
          <div
            class="absolute top-0 bottom-0 right-1 w-[60px] bg-[#FC2E6C] flex items-center justify-center z-0 rounded-md"
            @click="openDeleteModal(order)"
          >
            <span class="material-symbols-outlined"> delete </span>
          </div>

          <div
            class="relative z-0 flex items-center gap-4 px-3 h-[72px]"
            :style="{
              transform: `translateX(${order._ui.dragX}px)`,
              transition: 'transform 0.2s ease',
            }"
            :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
            @touchstart.passive="handleTouchStart($event, order)"
            @touchmove.passive="handleTouchMove($event, order)"
            @touchend="handleTouchEnd(order)"
          >
            <div class="flex flex-col justify-center items-end min-w-[50px] h-full">
              <BaseTypography class="text-gray-500 text-xs text-right">
                {{ formatToMMDD(order.createdAt) }}
              </BaseTypography>
              <BaseTypography class="text-xs text-gray-500 text-right">
                {{ formatToHHMM(order.createdAt) }}
              </BaseTypography>
            </div>

            <div class="flex-1 flex flex-col justify-center h-full overflow-hidden">
              <div class="h-[20px] overflow-hidden">
                <BaseTypography class="!font-bold text-sm truncate whitespace-nowrap">
                  {{ order.itemName }}
                </BaseTypography>
              </div>
              <div class="h-[18px] overflow-hidden flex gap-1 items-center">
                <BaseTypography
                  class="text-xs !font-semibold"
                  :color="order.status === '매수' ? 'red' : 'blue'"
                >
                  {{ order.status }}
                </BaseTypography>
                <BaseTypography class="text-xs !font-semibold">
                  {{ nfmt(order.totalPrice) }}원
                </BaseTypography>
              </div>
            </div>

            <div class="text-sm !font-black text-right min-w-[70px]">
              <BaseTypography class="text-xs text-gray-500">
                주문량 {{ nfmt(order.shares) }}주
              </BaseTypography>
              <BaseTypography class="text-xs !font-bold mt-1" :color="'red'">
                미체결량 {{ nfmt(order.pendingShares) }}주
              </BaseTypography>
            </div>
          </div>
        </div>
      </template>

      <!-- 📌 무한스크롤 트리거 -->
      <div ref="bottomRef" class="h-2"></div>

      <!-- ✅ 동일 로딩 아이콘 -->
      <div v-if="isLoading" class="flex justify-center py-4">
        <img
          src="@/assets/images/character/loading.png"
          alt="로딩 캐릭터"
          class="w-12 h-12 animate-spin opacity-70"
        />
      </div>
    </template>
  </div>

  <CancelConfirmModal
    :isOpen="isModalOpen"
    @close="closeModal"
    @submit="confirmDelete"
    title="정말 취소하시겠습니까?"
    description="주문 취소 시<br/>미체결 된 주식 전량이 취소됩니다."
    buttonText="취소하기"
    :disabled="isSubmitting"
  />
</template>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
