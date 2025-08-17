<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  order: { type: Object, required: true },
  index: { type: Number, required: true },
  touchStartHandler: { type: Function, required: true },
  touchMoveHandler: { type: Function, required: true },
  touchEndHandler: { type: Function, required: true },
})

const emit = defineEmits(['delete'])

function toIso(dateStr) {
  return typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr
}
function n(v, d = 0) {
  const num = Number(v)
  return Number.isFinite(num) ? num : d
}
function nfmt(v) {
  return n(v).toLocaleString()
}
function formatToMMDD(dateStr) {
  const d = new Date(toIso(dateStr))
  if (isNaN(d)) return '00.00'
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}.${day}`
}
function formatToHHMM(dateStr) {
  const d = new Date(toIso(dateStr))
  if (isNaN(d)) return '00:00'
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
function avgPrice(order) {
  const shares = n(order.shares, 1)
  return shares > 0 ? n(order.totalPrice) / shares : 0
}
</script>

<template>
  <div class="relative rounded-md overflow-hidden">
    <div
      class="absolute top-0 bottom-0 right-1 w-[60px] bg-[#FC2E6C] flex items-center justify-center z-0 rounded-md"
      @click="emit('delete', order)"
    >
      <span class="material-symbols-outlined"> delete </span>
    </div>

    <div
      class="relative z-0 flex items-center gap-4 px-3 h-[72px]"
      :style="{
        transform: `translateX(${order._ui?.dragX ?? 0}px)`,
        transition: 'transform 0.2s ease',
      }"
      :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
      @touchstart.passive="touchStartHandler($event, order)"
      @touchmove.passive="touchMoveHandler($event, order)"
      @touchend="touchEndHandler(order)"
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
            {{ nfmt(avgPrice(order)) }}원
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
