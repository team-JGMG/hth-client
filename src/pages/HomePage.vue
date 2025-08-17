<template>
  <div>
    <OnboardingPage v-if="!hasVisited" />
    <BaseLayout v-else>
      <SkeletonLoader v-if="loading" />
      <div v-else>
        <PointSection />
        <div class="flex space-x-3">
          <FundingListSection class="flex-1" />
          <TradeListSection class="flex-1" />
        </div>
        <PropertySection />
        <SaleCompleted />
      </div>
    </BaseLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { storeToRefs } from 'pinia'

import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import SaleCompleted from '@/components/main/SaleCompleted/SaleCompleted.vue'
import PropertySection from '@/components/main/PropertySection.vue'
import FundingListSection from '@/components/main/FundingListSection.vue'
import PointSection from '@/components/main/PointSection/PointSection.vue'
import TradeListSection from '@/components/main/TradeListSection.vue'
import SkeletonLoader from '@/components/common/Skeleton/SkeletonLoader.vue'

const onboardingStore = useOnboardingStore()
const { hasVisited } = storeToRefs(onboardingStore)

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>
