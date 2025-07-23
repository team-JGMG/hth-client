<template>
  <BlankLayout
    ><DetailHeader>{{}}</DetailHeader>
    <div class="funding-list-page">
      <div class="filter-tabs-container mb-2 shrink-0">
        <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto pb-24">
      <AskingPriceComponent v-if="currentFundingStatus === 'askingPrice'" />
      <StockChartComponent v-if="currentFundingStatus === 'stockChart'" />
    </div>

    <BuyAndSellPopOver>
      <div class="p-4 bg-black text-white rounded-b-lg">
        <div class="mb-4"></div>
        <button class="w-full py-3 bg-red-600 text-white font-bold rounded-md">구매하기</button>
      </div>
    </BuyAndSellPopOver>
  </BlankLayout>
</template>
<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AskingPriceComponent from '@/components/trade/AskingPriceComponent.vue'
import StockChartComponent from '@/components/trade/StockChartComponent.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

import DetailHeader from '@/layouts/DetailHeader.vue'
import BuyAndSellPopOver from '@/components/trade/BuyAndSellPopOver.vue'

const fundingStatusTabs = [
  { label: '호가', value: 'askingPrice' },
  { label: '시세', value: 'stockChart' },
]
const currentFundingStatus = ref('askingPrice')
</script>
