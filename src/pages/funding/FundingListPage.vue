<!-- 매물 목록 페이지 -->
<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>매물 목록 </DetailHeader>
        <div class="filter-tabs-container mb-2">
          <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <FundingListAll v-if="currentFundingStatus === 'all'" />
        <FundingListInProgress v-if="currentFundingStatus === 'inProgress'" />
        <FundingListCompletedFunding v-if="currentFundingStatus === 'completedFunding'" />
        <FundingListCompletedSale v-if="currentFundingStatus === 'completedSale'" />
      </div>
    </div>
  </BlankLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import FundingListAll from '@/components/funding/list/FundingListAll.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
import FundingListCompletedFunding from '@/components/funding/list/FundingListCompletedFunding.vue'
import FundingListCompletedSale from '@/components/funding/list/FundingListCompletedSale.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'

const fundingStatusTabs = [
  { label: '전체', value: 'all' },
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]
const currentFundingStatus = ref('all')
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
