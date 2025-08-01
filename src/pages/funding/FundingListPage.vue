<!-- 매물 목록 페이지 -->
<template>
  <BlankLayout>
    <DetailHeader>매물 목록 </DetailHeader>

    <div class="funding-list-page">
      <div class="filter-tabs-container mb-2 shrink-0">
        <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
      </div>
      <!-- 정렬 필터 -->
      <div class="flex justify-end mb-3 pr-4">
        <select v-model="currentSortOption" class="border px-2 py-1 rounded text-sm">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto pb-24">
      <FundingListInProgress v-if="currentFundingStatus === 'inProgress'" :items="fundingList" />
      <FundingListCompletedFunding
        v-if="currentFundingStatus === 'completedFunding'"
        :items="fundingList"
      />
      <FundingListCompletedSale
        v-if="currentFundingStatus === 'completedSale'"
        :items="fundingList"
      />
    </div>
  </BlankLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
import FundingListCompletedFunding from '@/components/funding/list/FundingListCompletedFunding.vue'
import FundingListCompletedSale from '@/components/funding/list/FundingListCompletedSale.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { getFundingList } from '@/api/funding'

const fundingStatusTabs = [
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]
const currentFundingStatus = ref('inProgress') //기본값: 모집 중

const sortOptions = [
  { label: '등록일', value: 'createdAt' },
  { label: '남은 시간', value: 'remainingTime' },
  { label: '모집률', value: 'fundingRate' },
]
const currentSortOption = ref('createdAt') // 기본값: 등록일

// API 호출 결과
const fundingList = ref([])

// 백엔드 파라미터로 매핑
const categoryMap = {
  inProgress: 'funding',
  completedFunding: 'ended',
  completedSale: 'sold',
}
const sortMap = {
  createdAt: 'date',
  remainingTime: 'timeLeft',
  fundingRate: 'rate',
}

const fetchFundingList = async () => {
  try {
    const category = categoryMap[currentFundingStatus.value]
    const sortOption = sortMap[currentSortOption.value]
    const res = await getFundingList(category, sortOption)

    console.log('펀딩 API 응답:', res.data)

    fundingList.value = res.data?.data?.content || []
  } catch (err) {
    console.error('펀딩 목록 불러오기 실패:', err.response?.data || err.message)
    fundingList.value = []
  }
}

// 초기 실행 + 반응형 실행
onMounted(fetchFundingList)
watch([currentFundingStatus, currentSortOption], fetchFundingList)
</script>
