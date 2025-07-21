<!-- 매물 목록 페이지 -->
<template>
  <DetailLayout>
    <BaseTypography class="text-2xl font-bold mb-4"> 매물 목록 </BaseTypography>

    <div class="funding-list-page">
      <div class="filter-tabs-container mb-4">
        <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
      </div>

      <div class="tab-content mt-4">
        <FundingListAll v-if="currentFundingStatus === 'all'" />
        <FundingListInProgress v-if="currentFundingStatus === 'inProgress'" />
        <FundingListCompletedFunding v-if="currentFundingStatus === 'completedFunding'" />
        <FundingListCompletedSale v-if="currentFundingStatus === 'completedSale'" />
      </div>
    </div>
  </DetailLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue' // BaseTab 재사용
import FundingListAll from '@/components/funding/list/FundingListAll.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
// import BaseLayout from '@/layouts/BaseLayout.vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import FundingListCompletedFunding from '@/components/funding/list/FundingListCompletedFunding.vue'
import FundingListCompletedSale from '@/components/funding/list/FundingListCompletedSale.vue'

const fundingStatusTabs = [
  { label: '전체', value: 'all' },
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]
const currentFundingStatus = ref('all')
</script>
