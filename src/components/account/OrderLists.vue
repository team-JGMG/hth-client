<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from './CancelConfirmModal.vue'
import LoadingSpinner from '../common/Spinner/LoadingSpinner.vue'
import { useToastStore } from '@/stores/toast'
import { getOrderHistory, cancelOrder } from '@/api/trade'
import OrderListItem from './OrderListsTab/OrderListItem.vue'

import { useInfiniteList } from '@/components/account/utils/useInfiniteList.js'

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
    _ui: { dragX: 0, touchStartX: 0 },
  }
}
function isCancelledStatus(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return false
  const u = s.toUpperCase()
  return u.includes('CANCEL') || u === 'CANCELED' || u === 'CANCELLED' || s === '취소'
}

const PAGE_SIZE = 5
const isFirstLoad = ref(true)
const loadError = ref(null)

const { items, isLoading, bottomRef, fetchNext, setupObserver, teardownObserver } = useInfiniteList(
  {
    pageSize: PAGE_SIZE,
    fetch: async ({ page, pageSize }) => {
      try {
        const res = await getOrderHistory(page, pageSize)
        return res?.data?.data ?? res?.data ?? []
      } catch (err) {
        loadError.value = err
        return []
      }
    },
    map: (row) => {
      const mapped = mapApiOrderToUi(row)
      const rawStatus = row?.orderStatus ?? row?.status ?? mapped?.status
      if (isCancelledStatus(rawStatus)) return null
      return mapped
    },
  },
)

const orders = items

const uniqueSortedOrders = computed(() => {
  const seen = new Set()
  const arr = []
  for (const o of orders.value || []) {
    if (!o) continue
    const key = o.id ?? `${o.createdAt}-${o.itemName}`
    if (seen.has(key)) continue
    seen.add(key)
    arr.push(o)
  }
  return arr.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
})

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const selectedOrder = ref(null)

function openDeleteModal(order) {
  selectedOrder.value = order
  isModalOpen.value = true
}
function resetSlide(order) {
  if (order && order._ui) order._ui.dragX = 0
}
function handleModalClose() {
  resetSlide(selectedOrder.value)
  isModalOpen.value = false
  selectedOrder.value = null
}
async function confirmDelete() {
  if (!selectedOrder.value || isSubmitting.value) return
  const target = selectedOrder.value
  const targetId = target.id
  if (!targetId) return toast.show('주문 ID를 찾을 수 없습니다.')
  isSubmitting.value = true
  try {
    await cancelOrder(targetId)
    orders.value = (orders.value || []).filter((o) => o && o.id !== targetId)
    isModalOpen.value = false
    selectedOrder.value = null
  } catch (e) {
    toast.show(e?.response?.data?.message || e?.message || '주문 취소에 실패했습니다.')
  } finally {
    resetSlide(target)
    isSubmitting.value = false
  }
}

function getYear(dateStr) {
  return parseDate(dateStr).getFullYear()
}
function isNewYear(index) {
  if (index === 0) return true
  const list = uniqueSortedOrders.value
  const currentYear = getYear(list[index].createdAt)
  const prevYear = getYear(list[index - 1].createdAt)
  return currentYear !== prevYear
}
function handleTouchStart(e, order) {
  ;(orders.value || []).forEach((o) => {
    if (o && o !== order && o._ui) o._ui.dragX = 0
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

onMounted(async () => {
  await fetchNext()
  setupObserver()
  isFirstLoad.value = false
})
onBeforeUnmount(() => {
  teardownObserver()
})
</script>

<template>
  <div class="py-3"></div>
  <div class="p-4 min-h-[600px] space-y-0">
    <div v-if="loadError && isFirstLoad" class="py-10 text-center text-red-500">
      거래 내역을 불러오지 못했습니다.
    </div>

    <div
      v-else-if="!uniqueSortedOrders.length && !isLoading"
      class="py-10 text-center text-gray-400"
    >
      주문 내역이 없습니다.
    </div>

    <template v-else>
      <template
        v-for="(order, index) in uniqueSortedOrders"
        :key="order.id ?? `${order.createdAt}-${order.itemName}-${index}`"
      >
        <BaseTypography v-if="isNewYear(index)" class="text-sm text-gray-500">
          {{ getYear(order.createdAt) }}년
        </BaseTypography>

        <OrderListItem
          :order="order"
          :index="index"
          :touchStartHandler="handleTouchStart"
          :touchMoveHandler="handleTouchMove"
          :touchEndHandler="handleTouchEnd"
          @delete="openDeleteModal"
        />
      </template>

      <div ref="bottomRef" class="h-2"></div>
      <div v-if="isLoading" class="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    </template>
  </div>

  <CancelConfirmModal
    :isOpen="isModalOpen"
    @close="handleModalClose"
    @submit="confirmDelete"
    title="정말 취소하시겠습니까?"
    description="주문 취소 시<br/>미체결 된 주식 전량이 취소됩니다."
    buttonText="취소하기"
    :disabled="isSubmitting"
  />
</template>

<style scoped></style>
