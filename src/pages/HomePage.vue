<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useOnboardingStore } from '@/stores/onboarding'
import { storeToRefs } from 'pinia'

import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'

const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()

const { getIsLoggedIn } = storeToRefs(authStore)
const { hasVisited } = storeToRefs(onboardingStore)

console.log('로그인 상태:', getIsLoggedIn.value)
console.log('온보딩 완료 여부:', hasVisited.value)
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
