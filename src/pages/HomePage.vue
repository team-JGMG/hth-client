<script setup>
import { useOnboardingStore } from '@/stores/onboarding'
import { storeToRefs } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
import OnboardingPage from './onboarding/OnboardingPage.vue'

const onboardingStore = useOnboardingStore()
const { hasVisited } = storeToRefs(onboardingStore)
</script>

<template>
  <div>
    <OnboardingPage v-if="!hasVisited" />
    <BaseLayout v-else>
      <PointSection />
      <div class="flex space-x-3">
        <FundingListSection class="flex-1" />
        <TradeListSection class="flex-1" />
      </div>
      <PropertySection />
      <SaleCompleted />
    </BaseLayout>
  </div>
</template>
