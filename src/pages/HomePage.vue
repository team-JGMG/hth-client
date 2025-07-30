<script setup>
// import { useOnboardingStore } from '@/stores/onboarding'
// import { storeToRefs } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

if (userStore.getIsLoggedIn) {
  console.log('로그인 상태입니다!')
} else {
  console.log('로그인하지 않았습니다.')
}
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
