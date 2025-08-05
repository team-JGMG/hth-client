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
import { ref, computed, onMounted } from 'vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useTradeStore } from '@/stores/tradeStore'
import api from '@/libs/axios'

const tradeStore = useTradeStore()
const currentPrice = computed(() => tradeStore.currentPrice)

const fundingId = ref(null)

onMounted(async () => {
  try {
    const listRes = await api.get('/api/funding/ended', {
      params: { page: 0, size: 10 },
    })

    const fundings = listRes.data?.data?.content || []

    if (fundings.length > 0) {
      fundingId.value = fundings[0].fundingId // 첫 번째 fundingId 사용
      const orderBookRes = await api.get(`/api/order-books/${fundingId.value}`)
      tradeStore.setTradeData(orderBookRes.data.data)
      console.log('현재 fundingId:', fundingId.value)
    } else {
      console.warn('펀딩 데이터가 없습니다.')
    }
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  }
})
</script>
