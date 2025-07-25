<template>
  <BlankLayout>
    <DetailHeader>{{}}</DetailHeader>
    <CurrentPrice />
    <div class="filter-tabs-container mb-2 shrink-0">
      <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <HogaPageComponent v-if="currentFundingStatus === 'askingPrice'" />
      <StockChartComponent v-if="currentFundingStatus === 'stockChart'" />
    </div>
    <BuyAndSellAccodian class="fixed bottom-16 left-0 right-0 max-w-md mx-auto">
    </BuyAndSellAccodian>
  </BlankLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import StockChartComponent from '@/components/trade/StockChartComponent.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BuyAndSellAccodian from '@/components/trade/BuyAndSell/BuyAndSellAccodian.vue'
import HogaPageComponent from '@/components/trade/Hoga/HogaPageComponent.vue'
import CurrentPrice from '@/components/trade/CurrentPrice.vue'

const fundingStatusTabs = [
  { label: '호가', value: 'askingPrice' },
  { label: '시세', value: 'stockChart' },
]
const currentFundingStatus = ref('askingPrice')
</script>
