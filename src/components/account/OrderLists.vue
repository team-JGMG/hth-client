<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import { formatDateTime } from '@/utils/format.js'
import { getOrderHistory } from '@/api/trade'
import { useAuthStore } from '@/stores/authStore'

// ===== 안전 유틸 =====
// 'YYYY-MM-DD HH:mm:ss' -> 'YYYY-MM-DDTHH:mm:ss' (iOS/Safari 파싱 대응)
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

// 날짜 포맷 유틸 (기존 유지)
function formatToMMDD(dateStr) {
  const [datePart] = formatDateTime(toIso(dateStr)).split(' ')
  const [, mm, dd] = (datePart || '').split('.')
  return `${String(mm || '00').padStart(2, '0')}.${String(dd || '00').padStart(2, '0')}`
}
function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(toIso(dateStr)).split(' ')
  return timePart || ''
}

// UI 보조 필드 세팅
const prepareOrders = (orderArray) =>
  orderArray.map((o) => ({
    ...o,
    _ui: { dragX: 0, touchStartX: 0 },
  }))

// 유저 ID (지금은 4로 고정, 나중에 authStore로 전환)
const authStore = useAuthStore()
const FALLBACK_USER_ID = 4
// 나중에 전환 시 주석 해제:
// const resolvedUserId = computed(() => authStore.userId || FALLBACK_USER_ID)

const orders = ref([])
const isLoading = ref(false)
const loadError = ref(null)
const debugInfo = ref('')

// 서버 응답 -> UI 모델 매핑 (안전)
function mapApiOrderToUi(o) {
  const pricePer = n(o?.orderPricePerShare)
  const shareCnt = n(o?.orderShareCount)
  return {
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

// 응답에서 배열 추출 (이번 API는 {status, data:[...]} 고정)
function unwrapToArray(res) {
  if (Array.isArray(res?.data)) return res.data
  if (Array.isArray(res?.data?.data)) return res.data.data // 방어
  return []
}

async function loadOrders() {
  isLoading.value = true
  loadError.value = null
  debugInfo.value = ''
  try {
    const userId = FALLBACK_USER_ID
    // 나중에 전환: const userId = resolvedUserId.value

    const res = await getOrderHistory(userId)
    const list = unwrapToArray(res)

    debugInfo.value = `status=${res?.data?.status || res?.status} | isArray=${Array.isArray(list)} | len=${list.length}`

    const mapped = list.map(mapApiOrderToUi)
    orders.value = prepareOrders(mapped)
  } catch (err) {
    console.error('❌ 거래 내역 불러오기 실패:', err)
    loadError.value = err
    orders.value = []
    debugInfo.value = `error=${err?.message || err}`
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOrders)

// 정렬/연도 헤더/슬라이드/모달 로직 (기존 유지)
const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt)),
)

const isModalOpen = ref(false)
const selectedOrder = ref(null)

function openDeleteModal(order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function confirmDelete() {
  if (!selectedOrder.value) return
  // 실제 취소 API 연동 전까지는 UI에서만 제거
  orders.value = orders.value.filter(
    (o) =>
      !(
        o.createdAt === selectedOrder.value.createdAt && o.itemName === selectedOrder.value.itemName
      ),
  )
  isModalOpen.value = false
}

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
    <div v-if="isLoading" class="py-10 text-center text-gray-400">불러오는 중…</div>
    <div v-else-if="loadError" class="py-10 text-center text-red-500">
      거래 내역을 불러오지 못했습니다.
    </div>

    <template v-else-if="sortedOrders.length">
      <template v-for="(order, index) in sortedOrders" :key="index">
        <BaseTypography v-if="isNewYear(index)" class="text-sm text-gray-500">
          {{ getYear(order.createdAt) }}년
        </BaseTypography>

        <div class="relative rounded-md overflow-hidden">
          <!-- 삭제 아이콘 영역 -->
          <div
            class="absolute top-0 bottom-0 right-1 w-[60px] bg-[#FC2E6C] flex items-center justify-center z-0 rounded-md"
            @click="openDeleteModal(order)"
          >
            <span class="material-symbols-outlined"> delete </span>
          </div>

          <!-- 카드 본체 -->
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
            <!-- 날짜/시간 -->
            <div class="flex flex-col justify-center items-end min-w-[50px] h-full">
              <BaseTypography class="text-gray-500 text-xs text-right">
                {{ formatToMMDD(order.createdAt) }}
              </BaseTypography>
              <BaseTypography class="text-xs text-gray-500 text-right">
                {{ formatToHHMM(order.createdAt) }}
              </BaseTypography>
            </div>

            <!-- 제목/설명 -->
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

            <!-- 주문량/상태 -->
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
    </template>

    <div v-else class="py-10 text-center text-gray-400">주문 내역이 없습니다.</div>
  </div>

  <CancelConfirmModal
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
    @submit="confirmDelete"
    title="정말 취소하시겠습니까?"
    description="주문 취소 시<br/>미체결 된 주식 전량이 취소됩니다."
    buttonText="취소하기"
  />
</template>
