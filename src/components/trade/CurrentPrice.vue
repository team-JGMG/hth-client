<script setup>
import { computed, onMounted } from 'vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useTradeStore } from '@/stores/tradeStore'
import api from '@/libs/axios'

const tradeStore = useTradeStore()
const currentPrice = computed(() => tradeStore.currentPrice)

const fundingId = 1

onMounted(async () => {
  try {
    const res = await api.get(`/api/order-books/${fundingId}`)
    tradeStore.setTradeData(res.data.data)
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  }
})
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
