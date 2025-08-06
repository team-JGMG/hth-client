<template>
  <div class="flex items-baseline gap-x-2">
    <BaseTypography size="2xl" weight="bold" class="mb-3">
      {{ currentPrice.toLocaleString() }}원
    </BaseTypography>
    <!-- 추후 거래차트 시 데이터 넣기 -->
    <BaseTypography>(2.39%)</BaseTypography>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useTradeStore } from '@/stores/tradeStore'
import { fetchOrderBookByFundingId } from '@/api/orderbook'

const tradeStore = useTradeStore()
const currentPrice = computed(() => tradeStore.currentPrice)

const route = useRoute()
const fundingId = computed(() => Number(route.params.id))

onMounted(async () => {
  if (!fundingId.value) {
    console.warn('❌ 유효하지 않은 fundingId')
    return
  }

  console.log('📌 상세 페이지 fundingId:', fundingId.value)

  try {
    await fetchOrderBookByFundingId(fundingId.value)
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  }
})

watch(currentPrice, (val) => {
  console.log('💰 currentPrice 변경됨:', val)
})
</script>
