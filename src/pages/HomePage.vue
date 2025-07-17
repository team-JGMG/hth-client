<template>
  <BaseLayout>
    <div>
      <h1>모달 테스트 페이지</h1>

      <BaseButton
        @click="openModal"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        모달 열기
      </BaseButton>

      <BaseModal :isOpen="isModalOpen" @close="closeModal">
        <h2 class="text-xl font-bold mb-4">모달 제목</h2>
        <p class="mb-4">이것은 모달 콘텐츠입니다. 원하는 내용을 여기에 넣어주세요.</p>
        <BaseButton
          @click="closeModal"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          닫기
        </BaseButton>
      </BaseModal>
    </div>
    <div class="funding-list-page">
      <div class="filter-tabs-container mb-4">
        <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
      </div>

      <div class="tab-content mt-4">
        <FundingListAll v-if="currentFundingStatus === 'all'" />
        <FundingListInProgress v-if="currentFundingStatus === 'inProgress'" />
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue' // BaseTab 재사용
import FundingListAll from '@/components/funding/list/FundingListAll.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'

const fundingStatusTabs = [
  { label: '전체', value: 'all' },
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]
const currentFundingStatus = ref('inProgress')
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>
