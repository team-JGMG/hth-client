<template>
  <div>
    <BaseTypography class="text-xl mb-1" color="white"> {{ userName }}님, </BaseTypography>
    <div class="mb-4 flex items-baseline justify-between">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">
        {{ formattedPoint }}
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  userName: { type: String, default: '???' },
  point: { type: [Number, String], default: null },
})

const formattedPoint = computed(() => {
  const v = props.point
  if (v === null || v === undefined || v === '') return '???원'
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n.toLocaleString() + '원' : '???원'
})
</script>
