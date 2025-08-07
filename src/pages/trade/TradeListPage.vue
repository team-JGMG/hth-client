<template>
  <BlankLayout>
    <DetailHeader>거래중인 건물</DetailHeader>
    <TradingListCard :items="tradeItems" />
  </BlankLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TradingListCard from '@/components/trade/TradingListCard.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { getEndedFundings } from '@/api/funding'

const tradeItems = ref([])

onMounted(async () => {
  try {
    const res = await getEndedFundings()
    console.log('[응답 확인]', res.data)
    tradeItems.value = res.data?.data?.content || []
  } catch (error) {
    console.error('펀딩 목록 불러오기 실패:', error)
  }
})
</script>
