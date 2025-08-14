<!-- OrderLists.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import { formatDateTime, formatDate } from '@/utils/format.js'
import { getOrderHistory, cancelOrder } from '@/api/trade'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

/* ========= 숫자 유틸 ========= */
function n(v, d = 0) {
  const num = Number(v)
  return Number.isFinite(num) ? num : d
}
function nfmt(v) {
  return n(v).toLocaleString()
}

/* ========= 날짜 유틸 (utils/format.js 기반) ========= */
function toDateFlexible(dt) {
  if (Array.isArray(dt)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = dt.map(Number)
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss)
  }
  if (typeof dt === 'string') return new Date(dt.replace(' ', 'T'))
  return new Date(dt)
}
const z2 = (x) => String(x).padStart(2, '0')

function formatToMMDD(val) {
  // 배열 → utils.formatDateTime 결과에서 MM.DD 추출
  if (Array.isArray(val)) {
    const out = formatDateTime(val) // "YYYY.M.D HH:MM"
    const datePart = out.split(' ')[0] || ''
    const [, m = '', d = ''] = datePart.split('.')
    return `${z2(m)}.${z2(d)}`
  }
  // 문자열/Date → utils.formatDate(YYYY.MM.DD)에서 MM.DD만 추출
  const full = formatDate(val) // "YYYY.MM.DD" | "-"
  if (!full || full === '-') return ''
  const [, mm, dd] = full.split('.')
  return `${mm}.${dd}`
}

function formatToHHMM(val) {
  if (Array.isArray(val)) {
    const out = formatDateTime(val) // "YYYY.M.D HH:MM"
    return out.split(' ')[1] || ''
  }
  const d = toDateFlexible(val)
  if (isNaN(d)) return ''
  return `${z2(d.getHours())}:${z2(d.getMinutes())}`
}

/* ========= 상태 ========= */
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

const bufferedMode = ref(false)
const bufferAll = ref([])
const bufferCursor = ref(0)

const prepareOrders = (arr) => arr.map((o) => ({ ...o, _ui: { dragX: 0, touchStartX: 0 } }))

/* ========= API → UI 매핑 ========= */
function mapApiOrderToUi(o) {
  const pricePer = n(o?.orderPricePerShare ?? o?.pricePerShare ?? o?.price_per_share)
  const shareCnt = n(o?.orderShareCount ?? o?.shareCount ?? o?.shares)
  const created =
    o?.createdAt ??
    o?.created_at ??
    o?.createdDate ??
    o?.orderDate ??
    o?.timestamp ??
    new Date().toISOString() // 배열/문자열/Date 어떤 형태든 그대로 보관

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
    createdAt: created,
    pendingShares: n(o?.remainingShareCount ?? o?.pendingShares ?? 0),
    _raw: o,
  }
}

/* ========= 언랩 ========= */
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

/* ========= 취소 상태 필터 ========= */
function isCancelledStatus(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return false
  const u = s.toUpperCase()
  return u.includes('CANCEL') || u === 'CANCELED' || u === 'CANCELLED' || s === '취소'
}
function mapAndFilter(list) {
  return list
    .map(mapApiOrderToUi)
    .filter((o) => !isCancelledStatus(o?._raw?.orderStatus ?? o?._raw?.status ?? o?.status))
}

/* ========= 로딩 ========= */
async function fetchOrdersPage() {
  if (isLoading.value) return

  if (bufferedMode.value) {
    return appendNextChunk(PAGE_SIZE)
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
        const mapped = mapAndFilter(paged.content || [])
        orders.value.push(...prepareOrders(mapped))
        added += mapped.length

        const nextFlag =
          typeof paged.meta?.hasNext === 'boolean' ? paged.meta.hasNext : paged.meta?.last === false
        hasNext.value = !!nextFlag
        if (nextFlag) page.value += 1
      } else {
        const arr = unwrapArray(res) || []
        bufferedMode.value = true
        bufferAll.value = arr
        bufferCursor.value = 0

        const target = Math.max(PAGE_SIZE - added, PAGE_SIZE)
        while (added < target && bufferCursor.value < bufferAll.value.length) {
          const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
          bufferCursor.value += slice.length
          const mapped = mapAndFilter(slice)
          orders.value.push(...prepareOrders(mapped))
          added += mapped.length
        }
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
      const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
      bufferCursor.value += slice.length

      const mapped = mapAndFilter(slice)
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

/* ========= 옵저버 ========= */
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
    { threshold: 0, rootMargin: '0px 0px 200px 0px' },
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

/* ========= 정렬/연도 ========= */
const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => toDateFlexible(b.createdAt) - toDateFlexible(a.createdAt)),
)

function getYear(dateLike) {
  return toDateFlexible(dateLike).getFullYear()
}
function isNewYear(index) {
  if (index === 0) return true
  const currentYear = getYear(sortedOrders.value[index].createdAt)
  const prevYear = getYear(sortedOrders.value[index - 1].createdAt)
  return currentYear !== prevYear
}

/* ========= 슬라이드/모달 ========= */
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
  if (selectedOrder.value) selectedOrder.value._ui.dragX = 0
  isModalOpen.value = false
  selectedOrder.value = null
}

async function confirmDelete() {
  if (!selectedOrder.value || isSubmitting.value) return
  const targetId = selectedOrder.value.id
  if (!targetId) {
    toast.error({
      title: '주문 ID 오류',
      body: '주문 ID를 찾을 수 없습니다.',
    })
    return
  }
  isSubmitting.value = true
  try {
    await cancelOrder(targetId)
    orders.value = orders.value.filter((o) => o.id !== targetId)
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

/* ========= 터치 삭제 슬라이드 ========= */
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

      <!-- 무한스크롤 트리거 -->
      <div ref="bottomRef" class="h-2"></div>

      <!-- 로딩 아이콘 -->
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
