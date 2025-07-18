<template>
  <DetailLayout>
    <BaseTypography class="text-2xl font-bold mb-4"> 펀딩 목록 </BaseTypography>

    <div>
      <BaseButton
        @click="openModal"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        모달 열기
      </BaseButton>

      <BaseModal :isOpen="isModalOpen" @close="closeModal">
        <BaseTypography class="text-lg font-semibold mb-4">모달 제목</BaseTypography>
        <BaseTypography class="mb-4">
          이 모달은 예시로, 원하는 내용을 여기에 넣을 수 있습니다.
        </BaseTypography>
      </BaseModal>
    </div>
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
    <!-- 예시: BaseCard 사용 -->
    <BaseCard title="공지사항">
      <!-- 카드 내부에 들어갈 내용 -->
      <BaseTypography class="mt-2 text-sm text-gray-500">
        컴포넌트 마구마구 재사용해주세용 통일성 통일성 ~~</BaseTypography
      >
    </BaseCard>
  </DetailLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue' // BaseTab 재사용
import FundingListAll from '@/components/funding/list/FundingListAll.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
// import BaseLayout from '@/layouts/BaseLayout.vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
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
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>
