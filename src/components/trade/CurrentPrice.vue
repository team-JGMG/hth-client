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
import { ref, onMounted, watch } from 'vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { getOrderBookByFundingId } from '@/api/orderbook'

const props = defineProps({
  fundingId: {
    type: [String, Number],
    required: true,
  },
})

const currentPrice = ref(0)

const fetchCurrentPrice = async () => {
  try {
    const res = await getOrderBookByFundingId(props.fundingId)
    currentPrice.value = res.data?.data?.currentPrice || 0
  } catch (err) {
    console.error('📉 현재가 조회 실패:', err)
  }
}

onMounted(fetchCurrentPrice)
watch(() => props.fundingId, fetchCurrentPrice)
</script>
