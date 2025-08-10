<!-- TradeHistory.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import { formatDateTime } from '@/utils/format.js'
import { getOrderHistory, cancelOrder } from '@/api/trade'

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

const FALLBACK_USER_ID = 4

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
  const pricePer = n(o?.orderPricePerShare)
  const shareCnt = n(o?.orderShareCount)
  return {
    id: o?.orderId ?? o?.id,
    itemName: o?.propertyTitle ?? '',
    shares: shareCnt,
    totalPrice: pricePer * shareCnt,
    status:
      o?.orderType === 'BUY' ? '매수' : o?.orderType === 'SELL' ? '매도' : (o?.orderType ?? ''),
    createdAt: toIso(o?.createdAt),
    pendingShares: n(o?.remainingShareCount, 0),
    _raw: o,
  }
}

function unwrapServerPaging(res) {
  return Array.isArray(res?.data?.data?.content) ? res.data.data : null
}
function unwrapArray(res) {
  if (Array.isArray(res?.data?.data)) return res.data.data
  if (Array.isArray(res?.data)) return res.data
  return null
}

async function fetchOrdersPage() {
  if (isLoading.value) return

  // 클라 청크 모드면 다음 청크만 추가
  if (bufferedMode.value) {
    return appendNextChunk()
  }

  if (!hasNext.value) return
  isLoading.value = true
  try {
    const res = await getOrderHistory(FALLBACK_USER_ID, page.value, PAGE_SIZE)
    await delay(2000)

    const paged = unwrapServerPaging(res)
    if (paged) {
      // ✅ 서버 페이징
      const mapped = paged.content.map(mapApiOrderToUi).filter((o) => {
        const raw = o?._raw?.orderStatus ?? o?._raw?.status ?? ''
        return !['CANCELLED', '취소', 'REFUNDED'].includes(String(raw).toUpperCase())
      })
      orders.value.push(...prepareOrders(mapped))

      const nextFlag = !!paged.hasNext || paged.last === false
      hasNext.value = nextFlag
      if (nextFlag) page.value += 1
    } else {
      // ✅ 서버가 배열만 줌 → 클라 청크 모드 전환 + 첫 청크 직접 푸시(버그 fix)
      const arr = unwrapArray(res) || []
      bufferedMode.value = true
      bufferAll.value = arr
      bufferCursor.value = 0

      // 첫 청크 직접 처리 (isLoading=true 상태여서 appendNextChunk()가 return 되던 문제 해결)
      const firstSlice = bufferAll.value.slice(0, PAGE_SIZE)
      bufferCursor.value = firstSlice.length

      const firstMapped = firstSlice.map(mapApiOrderToUi).filter((o) => {
        const raw = o?._raw?.orderStatus ?? o?._raw?.status ?? ''
        return !['CANCELLED', '취소', 'REFUNDED'].includes(String(raw).toUpperCase())
      })
      orders.value.push(...prepareOrders(firstMapped))
    }
  } catch (err) {
    console.error('❌ 거래 내역 불러오기 실패:', err)
    loadError.value = err
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

async function appendNextChunk() {
  if (isLoading.value) return
  const total = bufferAll.value.length
  if (bufferCursor.value >= total) return

  isLoading.value = true
  try {
    await delay(2000)
    const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
    bufferCursor.value += slice.length

    const mapped = slice.map(mapApiOrderToUi).filter((o) => {
      const raw = o?._raw?.orderStatus ?? o?._raw?.status ?? ''
      return !['CANCELLED', '취소', 'REFUNDED'].includes(String(raw).toUpperCase())
    })
    orders.value.push(...prepareOrders(mapped))
  } catch (e) {
    console.error('❌ 청크 추가 실패:', e)
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

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
    { threshold: 1 },
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
  selectedOrder.value = order
  isModalOpen.value = true
}
async function confirmDelete() {
  if (!selectedOrder.value || isSubmitting.value) return
  const targetId = selectedOrder.value.id
  if (!targetId) return alert('주문 ID를 찾을 수 없습니다.')
  isSubmitting.value = true
  try {
    await cancelOrder(targetId)
    orders.value = orders.value.filter((o) => o.id !== targetId)
    isModalOpen.value = false
    selectedOrder.value = null
  } catch (e) {
    console.error('[confirmDelete] cancel failed:', e?.response?.status, e?.response?.data, e)
    alert(e?.response?.data?.message || e?.message || '주문 취소에 실패했습니다.')
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
    @close="isModalOpen = false"
    @submit="confirmDelete"
    title="정말 취소하시겠습니까?"
    description="주문 취소 시<br/>미체결 된 주식 전량이 취소됩니다."
    buttonText="취소하기"
    :disabled="isSubmitting"
  />
</template>

<style scoped>
.animate-spin {
  animation: spin 0.4s linear infinite;
}
</style>
