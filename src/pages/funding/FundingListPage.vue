<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>매물 목록</DetailHeader>

        <div class="funding-list-page">
          <div class="filter-tabs-container mb-2 shrink-0">
            <BaseTab :tabs="fundingStatusTabs" v-model="currentFundingStatus" />
          </div>
        </div>

        <div class="flex justify-end mb-3 pr-4">
          <select v-model="currentSortOption" class="border px-2 py-1 rounded text-xs">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

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
            src="@/assets/images/character/loading.png"
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
import { useRoute, useRouter } from 'vue-router'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import FundingListInProgress from '@/components/funding/list/FundingListInProgress.vue'
import FundingListCompletedFunding from '@/components/funding/list/FundingListCompletedFunding.vue'
import FundingListCompletedSale from '@/components/funding/list/FundingListCompletedSale.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { getFundingList } from '@/api/funding'

const route = useRoute()
const router = useRouter()

const fundingStatusTabs = [
  { label: '모집 중', value: 'inProgress' },
  { label: '펀딩 완료', value: 'completedFunding' },
  { label: '매각 완료', value: 'completedSale' },
]

function getStatusFromPath(path) {
  if (path.includes('in-progress')) return 'inProgress'
  if (path.includes('completed-funding')) return 'completedFunding'
  if (path.includes('completed-sale')) return 'completedSale'
  return 'inProgress'
}
const currentFundingStatus = ref(getStatusFromPath(route.path))

watch(currentFundingStatus, (newStatus) => {
  const pathMap = {
    inProgress: '/funding/list/in-progress',
    completedFunding: '/funding/list/completed-funding',
    completedSale: '/funding/list/completed-sale',
  }
  router.push(pathMap[newStatus])
})

const sortOptions = [
  { label: '등록일', value: 'createdAt' },
  { label: '남은 시간', value: 'remainingTime' },
  { label: '모집률', value: 'fundingRate' },
]
const currentSortOption = ref('createdAt')

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

const fundingList = ref([])
const page = ref(0)
const size = 10
const hasNextPage = ref(true)
const isLoading = ref(false)

const scrollContainerRef = ref(null)
const bottomRef = ref(null)
let observer = null

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

    await delay(20)

    fundingList.value.push(...res.data.data.content)
    hasNextPage.value = !res.data.data.last
    page.value += 1
  } catch {
    //
  } finally {
    isLoading.value = false
  }
}

const setupObserver = async () => {
  await nextTick()
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasNextPage.value && !isLoading.value) {
        fetchFundingList()
      }
    },
    {
      threshold: 1.0,
      root: scrollContainerRef.value,
    },
  )

  if (bottomRef.value) observer.observe(bottomRef.value)
}

watch([currentFundingStatus, currentSortOption], async () => {
  page.value = 0
  hasNextPage.value = true
  fundingList.value = []

  if (scrollContainerRef.value) scrollContainerRef.value.scrollTop = 0

  await fetchFundingList()
  await setupObserver()
})

onMounted(async () => {
  await fetchFundingList()
  await setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
