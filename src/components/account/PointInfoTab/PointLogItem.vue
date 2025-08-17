<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  log: { type: Object, required: true },
  index: { type: Number, required: true },
})

const z2 = (n) => String(n).padStart(2, '0')
function toDateFlexible(dt) {
  if (Array.isArray(dt)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = dt
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss)
  }
  if (typeof dt === 'string') return new Date(dt.replace(' ', 'T'))
  return new Date(dt)
}
function formatMMDD(dt) {
  const d = toDateFlexible(dt)
  if (Number.isNaN(d.getTime())) return '--.--'
  return `${z2(d.getMonth() + 1)}.${z2(d.getDate())}`
}
function formatHHMM(dt) {
  const d = toDateFlexible(dt)
  if (Number.isNaN(d.getTime())) return '--:--'
  return `${z2(d.getHours())}:${z2(d.getMinutes())}`
}
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between rounded-md px-3 h-[72px] overflow-hidden',
      index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
    ]"
  >
    <div class="flex flex-col items-end min-w-[50px]">
      <BaseTypography class="text-gray-500 text-xs text-right">
        {{ formatMMDD(log.date) }}
      </BaseTypography>
      <BaseTypography class="text-xs text-gray-500 text-right">
        {{ formatHHMM(log.date) }}
      </BaseTypography>
    </div>

    <BaseTypography class="!font-bold text-sm truncate whitespace-nowrap flex-1 mx-3 text-left">
      {{ log.title }}
    </BaseTypography>

    <BaseTypography class="text-sm !font-black min-w-[72px] text-right">
      <span :class="log.amount > 0 ? 'text-blue-600' : 'text-red-600'">
        {{ log.amount > 0 ? '+' : '-' }}{{ Math.abs(log.amount).toLocaleString() }}
      </span>
    </BaseTypography>
  </div>
</template>
