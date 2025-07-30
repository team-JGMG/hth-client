<script setup>
import { ref, computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import { formatDateTime } from '@/utils/format.js'

function formatToMMDD(dateStr) {
  const [datePart] = formatDateTime(dateStr).split(' ')
  const [, mm, dd] = datePart.split('.')
  return `${mm.padStart(2, '0')}.${dd.padStart(2, '0')}`
}

function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(dateStr).split(' ')
  return timePart
}

const prepareOrders = (orderArray) =>
  orderArray.map((o) => ({
    ...o,
    _ui: { dragX: 0, touchStartX: 0 },
  }))

const orders = ref(
  prepareOrders([
    {
      itemName: '대전 한화 스타트업 파크',
      shares: 2,
      totalPrice: 11250,
      status: '매도',
      createdAt: '2025-07-14T11:11:00',
      pendingShares: 1, // ← 미체결량
    },
    {
      itemName: '대전 한화 스타트업 파크',
      shares: 2,
      totalPrice: 11250,
      status: '매수',
      createdAt: '2025-07-14T11:11:00',
      pendingShares: 2, // ← 미체결량
    },
    {
      itemName: '대전 한화 스타트업 파크',
      shares: 2,
      totalPrice: 11250,
      status: '매도',
      createdAt: '2024-07-14T11:11:00',
      pendingShares: 0, // ← 미체결량
    },
    {
      itemName: '대전 한화 스타트업 파크',
      shares: 2,
      totalPrice: 11250,
      status: '매수',
      createdAt: '2024-06-14T11:11:00',
      pendingShares: 1, // ← 미체결량
    },
    {
      itemName: '대전 한화 스타트업 파크',
      shares: 2,
      totalPrice: 11250,
      status: '매도',
      createdAt: '2024-05-14T11:11:00',
      pendingShares: 3, // ← 미체결량
    },
  ]),
)

const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
)

const isModalOpen = ref(false)
const selectedOrder = ref(null)

function openDeleteModal(order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function confirmDelete() {
  if (!selectedOrder.value) return
  orders.value = orders.value.filter(
    (o) =>
      !(
        o.createdAt === selectedOrder.value.createdAt && o.itemName === selectedOrder.value.itemName
      ),
  )
  isModalOpen.value = false
}

function getYear(dateStr) {
  return new Date(dateStr).getFullYear()
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
  <div class="p-4 min-h-[600px] space-y-0">
    <template v-if="sortedOrders.length">
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
              <!-- 설명 영역: 금액은 검정, 매수/매도는 색상 적용 -->
              <div class="h-[18px] overflow-hidden flex gap-1 items-center">
                <!-- 매수/매도 텍스트 먼저 -->
                <BaseTypography
                  class="text-xs !font-semibold"
                  :color="order.status === '매수' ? 'red' : 'blue'"
                >
                  {{ order.status }}
                </BaseTypography>

                <!-- 금액 텍스트는 검은색 그대로 -->
                <BaseTypography class="text-xs !font-semibold">
                  {{ order.totalPrice.toLocaleString() }}원
                </BaseTypography>
              </div>
            </div>

            <!-- 주문량/상태 -->
            <!-- 주문량/상태 -->
            <div class="text-sm !font-black text-right min-w-[70px]">
              <BaseTypography class="text-xs text-gray-500">
                주문량 {{ order.shares }}주
              </BaseTypography>
              <BaseTypography class="text-xs !font-bold mt-1" :color="'red'">
                미체결량 {{ order.pendingShares }}주
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
