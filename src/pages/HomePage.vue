<template>
  <BaseLayout>
    <PointSection />
    <div class="flex space-x-3">
      <FundingListSection class="flex-1" /> <TradeListSection class="flex-1" />
    </div>
    <PropertySection />
    <SaleCompleted />
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
</script>
