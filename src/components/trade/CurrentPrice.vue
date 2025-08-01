<script setup>
import { computed } from 'vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useTradeStore } from '@/stores/tradeStore'

const tradeStore = useTradeStore()
const currentPrice = computed(() => tradeStore.currentPrice)
</script>

<template>
  <div class="flex items-baseline gap-x-2">
    <BaseTypography size="2xl" weight="bold" class="mb-3">
      {{ currentPrice.toLocaleString() }}원
    </BaseTypography>
    <!-- 추후 거래차트 시 데이터 넣기 -->
    <BaseTypography>(2.39%)</BaseTypography>
  </div>
</template>
