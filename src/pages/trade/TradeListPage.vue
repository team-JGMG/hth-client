<template>
  <BlankLayout>
    <DetailHeader>거래중인 건물</DetailHeader>
    <TradingListCard :items="mockTradeListData" />
  </BlankLayout>
</template>

<script setup>
import TradingListCard from '@/components/trade/TradingListCard.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { mockTradeListData } from '@/utils/mockTradeListData.js'
</script>
