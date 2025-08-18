<template>
  <div class="flex items-baseline gap-x-2">
    <BaseTypography size="2xl" weight="bold" class="mb-3">
      {{ (currentPrice ?? 0).toLocaleString() }}원
    </BaseTypography>
    <BaseTypography> ({{ percentageChange.toFixed(2) }}%) </BaseTypography>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const props = defineProps({
  currentPrice: {
    type: Number,
    default: 0,
  },
})

const basePrice = 5000

const percentageChange = computed(() => {
  if (!basePrice) return 0
  return ((props.currentPrice - basePrice) / basePrice) * 100
})
</script>
