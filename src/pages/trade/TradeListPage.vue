<template>
  <BlankLayout>
    <DetailHeader>거래중인 건물</DetailHeader>
    <TradingListCard :items="tradeItems" />
  </BlankLayout>
</template>

<script setup>
import { fetchEndedFundings } from '@/api/funding'
import TradingListCard from '@/components/trade/TradingListCard.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { ref, onMounted } from 'vue'

const tradeItems = ref([])

onMounted(async () => {
  tradeItems.value = await fetchEndedFundings()
  console.log('✅ tradeItems:', tradeItems.value)
})
</script>
