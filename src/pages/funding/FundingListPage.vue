<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>매물 목록</DetailHeader>

        <!-- 필터 탭 -->
        <div class="funding-list-page">
          <div class="filter-tabs-container mb-2 shrink-0">
            <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
          </div>
        </div>

        <!-- 정렬 필터 -->
        <div class="flex justify-end mb-3 pr-4">
          <select v-model="currentSortOption" class="border px-2 py-1 rounded text-xs">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 스크롤 영역 -->
      <div ref="scrollContainerRef" class="flex-1 overflow-y-auto pb-24 scrollbar-none">
        <div v-if="currentFundingStatus === 'inProgress'">
          <FundingListInProgress :items="fundingList" />
        </div>

        <div v-else-if="currentFundingStatus === 'completedFunding'">
          <FundingListCompletedFunding :items="fundingList" />
        </div>

        <div v-else-if="currentFundingStatus === 'completedSale'">
          <FundingListCompletedSale :items="fundingList" />
        </div>

        <div ref="bottomRef" class="h-2" />
        <div v-if="isLoading" class="flex justify-center py-4">
          <img
            src="@/assets/images/character/HOMEch.png"
            alt="로딩 캐릭터"
            class="w-12 h-12 animate-spin opacity-70"
          />
        </div>
      </div>
    </div>
  </BlankLayout>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
import FundingListCompletedFunding from '@/components/funding/list/FundingListCompletedFunding.vue'
import FundingListCompletedSale from '@/components/funding/list/FundingListCompletedSale.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { getFundingList } from '@/api/funding'

// 필터 설정
const fundingStatusTabs = [
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]
const currentFundingStatus = ref('inProgress')
const sortOptions = [
  { label: '등록일', value: 'createdAt' },
  { label: '남은 시간', value: 'remainingTime' },
  { label: '모집률', value: 'fundingRate' },
]
const currentSortOption = ref('createdAt')

// API 파라미터 매핑
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

// 상태 변수
const fundingList = ref([])
const page = ref(0)
const size = 10
const hasNextPage = ref(true)
const isLoading = ref(false)

const scrollContainerRef = ref(null)
const bottomRef = ref(null)
let observer = null

// 딜레이 넣기
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 펀딩 목록 불러오기
const fetchFundingList = async () => {
  if (isLoading.value || !hasNextPage.value) return

  isLoading.value = true
  try {
    const res = await getFundingList(
      categoryMap[currentFundingStatus.value],
      sortMap[currentSortOption.value],
      page.value,
      size,
    )

    await delay(300) // 0.3초 대기

    fundingList.value.push(...res.data.data.content)
    hasNextPage.value = !res.data.data.last
    page.value += 1
  } catch (err) {
    console.error('펀딩 목록 불러오기 실패:', err)
  } finally {
    isLoading.value = false
  }
}

const setupObserver = async () => {
  await nextTick()
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      console.log('👁️ 옵저버 감지됨:', entry.isIntersecting)
      console.log('🧪 isLoading:', isLoading.value, 'hasNextPage:', hasNextPage.value)

      if (entry.isIntersecting && hasNextPage.value && !isLoading.value) {
        console.log('🔥 조건 만족 → fetchFundingList 실행')
        fetchFundingList()
      }
    },
    {
      threshold: 1.0,
      root: scrollContainerRef.value, // ✅ 스크롤 기준을 지정
    },
  )

  if (bottomRef.value) {
    console.log('🎯 옵저버 등록됨')
    observer.observe(bottomRef.value)
  }
}

// 필터 변경 시 초기화
watch([currentFundingStatus, currentSortOption], async () => {
  page.value = 0
  hasNextPage.value = true
  fundingList.value = []

  if (scrollContainerRef.value) scrollContainerRef.value.scrollTop = 0

  await fetchFundingList()
  await setupObserver()
})

// 진입 시 초기 데이터 + 옵저버 연결
onMounted(async () => {
  await fetchFundingList()
  await setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* 회전 애니메이션 Tailwind 기본 */
.animate-spin {
  animation: spin 0.4s linear infinite;
}
</style>
