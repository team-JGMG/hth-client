<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <DetailHeader>거래중인 건물</DetailHeader>

      <div ref="scrollContainerRef" class="flex-1 overflow-y-auto pb-24 scrollbar-none">
        <TradingListCard :items="tradeItems" />
        <div ref="bottomRef" class="h-2" />
        <div v-if="isLoading" class="flex justify-center py-4">
          <img
            src="@/assets/images/character/loading.png"
            class="w-12 h-12 animate-spin opacity-70"
          />
        </div>
      </div>
    </div>
  </BlankLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import TradingListCard from '@/components/trade/TradingListCard.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { getEndedFundings } from '@/api/funding'

const tradeItems = ref([])
const page = ref(0)
const size = 10
const hasNextPage = ref(true)
const isLoading = ref(false)

const scrollContainerRef = ref(null)
const bottomRef = ref(null)
let observer = null

// 딜레이 넣기
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchTradeItems = async () => {
  if (isLoading.value || !hasNextPage.value) return

  isLoading.value = true
  try {
    const res = await getEndedFundings(page.value, size)
    await new Promise((r) => setTimeout(r, 300)) // 딜레이 추가
    await delay(20)
    tradeItems.value.push(...res.data.data.content)
    hasNextPage.value = !res.data.data.last
    page.value += 1
    console.log('🧾 전체 누적 데이터 (tradeItems):', tradeItems.value)
  } catch (err) {
    console.error('거래중인 건물 불러오기 실패:', err)
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
        console.log('🔥 조건 만족 → fetchTradeItems 실행')
        fetchTradeItems()
      }
    },
    {
      threshold: 1.0,
      root: scrollContainerRef.value,
    },
  )

  if (bottomRef.value) {
    observer.observe(bottomRef.value)
  }
}

onMounted(async () => {
  await fetchTradeItems()
  await setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>
