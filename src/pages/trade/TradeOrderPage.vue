<template>
  <BlankLayout>
    <DetailHeader>{{}}</DetailHeader>
    <div class="funding-list-page">
      <div class="filter-tabs-container mb-2 shrink-0">
        <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <AskingPriceComponent v-if="currentFundingStatus === 'askingPrice'" />
      <StockChartComponent v-if="currentFundingStatus === 'stockChart'" />
    </div>
    <BuyAndSellAccodian class="fixed bottom-16 left-0 right-0 max-w-md mx-auto">
    </BuyAndSellAccodian>
  </BlankLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AskingPriceComponent from '@/components/trade/AskingPriceComponent.vue'
import StockChartComponent from '@/components/trade/StockChartComponent.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BuyAndSellAccodian from '@/components/trade/BuyAndSell/BuyAndSellAccodian.vue'

const fundingStatusTabs = [
  { label: '호가', value: 'askingPrice' },
  { label: '시세', value: 'stockChart' },
]
const currentFundingStatus = ref('askingPrice')
</script>
