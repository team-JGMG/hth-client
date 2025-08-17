<template>
  <div class="flex items-baseline gap-x-2">
    <BaseTypography size="2xl" weight="bold" class="mb-3">
      {{ (currentPrice ?? 0).toLocaleString() }}원
    </BaseTypography>
    <BaseTypography>(2.39%)</BaseTypography>
  </div>
</template>

<script setup>
import BaseTypography from '../common/Typography/BaseTypography.vue'

defineProps({
  currentPrice: {
    type: Number,
    default: 0,
  },
})
</script>
