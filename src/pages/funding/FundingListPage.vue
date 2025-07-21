<!-- 매물 목록 페이지 -->
<!-- <template>FundingListPage</template>
<script setup></script> -->

<template>
  <BaseLayout>
    FundingDetailPage<PointSection />
    <FundingListSection />

    <PropertySection />
    <TradeListSection
  /></BaseLayout>
</template>
<script setup>
import PointSection from '@/components/main/PointSection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
</script>
