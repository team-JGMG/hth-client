<!-- src/components/.../OrderlistsTab/OrderListItem.vue -->
<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatDateTime } from '@/utils/format.js'

defineProps({
  order: { type: Object, required: true },
  index: { type: Number, required: true },
  touchStartHandler: { type: Function, required: true },
  touchMoveHandler: { type: Function, required: true },
  touchEndHandler: { type: Function, required: true },
})

const emit = defineEmits(['delete'])

/** ------ 로컬 보조 함수 (부모와 동일 포맷 유지) ------ */
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
  const [datePart] = formatDateTime(toIso(dateStr)).split(' ')
  const [, mm, dd] = (datePart || '').split('.')
  return `${String(mm || '00').padStart(2, '0')}.${String(dd || '00').padStart(2, '0')}`
}
function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(toIso(dateStr)).split(' ')
  return timePart || ''
}
function avgPrice(order) {
  const shares = n(order.shares, 1) // 0 방지용 디폴트 1
  return shares > 0 ? n(order.totalPrice) / shares : 0
}
</script>

<template>
  <div class="relative rounded-md overflow-hidden">
    <!-- 삭제 슬라이드 뒤 배경(우측 빨간 영역) -->
    <div
      class="absolute top-0 bottom-0 right-1 w-[60px] bg-[#FC2E6C] flex items-center justify-center z-0 rounded-md"
      @click="emit('delete', order)"
    >
      <span class="material-symbols-outlined"> delete </span>
    </div>

    <!-- 실제 아이템 한 줄 -->
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
      <!-- 날짜/시간 -->
      <div class="flex flex-col justify-center items-end min-w-[50px] h-full">
        <BaseTypography class="text-gray-500 text-xs text-right">
          {{ formatToMMDD(order.createdAt) }}
        </BaseTypography>
        <BaseTypography class="text-xs text-gray-500 text-right">
          {{ formatToHHMM(order.createdAt) }}
        </BaseTypography>
      </div>

      <!-- 타이틀/가격 -->
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

      <!— 수량/미체결 —>
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
