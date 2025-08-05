<template>
  <div class="mt-8 pb-48">
    <BaseTab v-model="currentTab" :tabs="tabs" class="mb-4" />
    <component :is="tabComponent" :item="item" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import FundingBuildingInfo from './tab/FundingBuildingInfo.vue'
import FundingInvestmentInfo from './tab/FundingInvestmentInfo.vue'
import FundingFundingInfo from './tab/FundingFundingInfo.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const currentTab = ref('building')
const tabs = [
  { label: '건물 정보', value: 'building' },
  { label: '투자 정보', value: 'investment' },
  { label: '펀딩 정보', value: 'funding' },
]

const tabComponent = computed(() => {
  switch (currentTab.value) {
    case 'building':
      return FundingBuildingInfo
    case 'investment':
      return FundingInvestmentInfo
    case 'funding':
      return FundingFundingInfo
    default:
      return FundingBuildingInfo
  }
})
</script>
