<template>
  <BlankLayout>
    <DetailHeader>메롱</DetailHeader>
    <PointSection />
    <FundingListSection />
    <TradeListSection />
    <PropertySection />
    <SaleCompleted />
    <CommonNav />
  </BlankLayout>
</template>

<script setup>
// import BaseLayout from '@/layouts/BaseLayout.vue'
// import DetailLayout from '@/layouts/DetailLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import CommonNav from '@/layouts/CommonNav.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
</script>
