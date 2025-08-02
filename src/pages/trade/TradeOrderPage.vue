<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>{{ tradeItem.name }}</DetailHeader>
        <div class="bg-white pt-0">
          <CurrentPrice />
          <div class="filter-tabs-container mb-2">
            <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pb-28 no-scrollbar">
        <OrderbookChart
          v-if="currentFundingStatus === 'askingPrice'"
          :refreshTrigger="chartRefreshTrigger"
        />
        <TradeHistoryChart ref="tradeHistoryChart" v-if="currentFundingStatus === 'stockChart'" />
      </div>
    </div>

    <BuyAndSellAccodian
      @trade-completed="handleTradeCompleted"
      class="fixed bottom-16 left-0 right-0 max-w-md mx-auto"
    />
  </BlankLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BuyAndSellAccodian from '@/components/trade/BuyAndSell/BuyAndSellAccodian.vue'
import CurrentPrice from '@/components/trade/CurrentPrice.vue'
import TradeHistoryChart from '@/components/trade/TradeHistoryChart.vue'
import OrderbookChart from '@/components/trade/Hoga/OrderbookChart.vue'
import { useRoute } from 'vue-router'
import { fetchEndedFundings } from '@/api/funding'

const route = useRoute()
const tradeId = Number(route.params.id)
const tradeItem = ref({ name: '' })

const tradeHistoryChart = ref(null)
const chartRefreshTrigger = ref(0)

const handleTradeCompleted = () => {
  if (tradeHistoryChart.value) {
    tradeHistoryChart.value.fetchChartData()
  }
  chartRefreshTrigger.value++
  console.log('TradeOrderPage - chartRefreshTrigger incremented to:', chartRefreshTrigger.value)
}

const fundingStatusTabs = [
  { label: '호가', value: 'askingPrice' },
  { label: '시세', value: 'stockChart' },
]
const currentFundingStatus = ref('askingPrice')

onMounted(async () => {
  const items = await fetchEndedFundings()
  const found = items.find((item) => item.fundingId === tradeId)
  if (found) {
    tradeItem.value = {
      name: found.title,
      ...found,
    }
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
