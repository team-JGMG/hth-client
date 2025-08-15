<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>{{ tradeItem.title }}</DetailHeader>
        <div class="bg-white pt-0">
          <CurrentPrice :fundingId="tradeId" />
          <div class="flex justify-center px-4 mb-4">
            <div class="flex bg-transparent">
              <button
                @click="currentFundingStatus = 'askingPrice'"
                :class="[
                  'px-16 break-keep py-3 text-base font-medium transition-all duration-200',
                  currentFundingStatus === 'askingPrice'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600',
                ]"
              >
                호가
              </button>
              <button
                @click="currentFundingStatus = 'stockChart'"
                :class="[
                  'px-16 py-3 break-keep text-base font-medium transition-all duration-200',
                  currentFundingStatus === 'stockChart'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600',
                ]"
              >
                시세
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pb-28 no-scrollbar">
        <OrderbookChart
          v-if="currentFundingStatus === 'askingPrice'"
          :refreshTrigger="chartRefreshTrigger"
          :fundingId="tradeId"
          :key="`orderbook-${tradeId}-${chartRefreshTrigger}`"
        />
        <TradingChartContainer
          ref="tradeHistoryChart"
          v-if="currentFundingStatus === 'stockChart'"
          :fundingId="tradeId"
        />
      </div>
    </div>

    <BuyAndSellAccodian
      @trade-completed="handleTradeCompleted"
      class="fixed bottom-16 left-0 right-0 max-w-md mx-auto"
      :fundingId="tradeId"
    />
  </BlankLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BuyAndSellAccodian from '@/components/trade/BuyAndSell/BuyAndSellAccodian.vue'
import CurrentPrice from '@/components/trade/CurrentPrice.vue'
import OrderbookChart from '@/components/trade/Hoga/OrderbookChart.vue'
import { getFundingById } from '@/api/funding'
import TradingChartContainer from '@/components/trade/TradeListChart/TradingChartContainer.vue'

const route = useRoute()
const tradeId = ref(Number(route.params.id))
const tradeItem = ref({})
const tradeHistoryChart = ref(null)
const chartRefreshTrigger = ref(0)

const fetchFundingDetail = async (id) => {
  try {
    const res = await getFundingById(id)
    tradeItem.value = res.data?.data || {}
  } catch (e) {
    console.error('상세 정보 로딩 실패:', e)
  }
}

// 페이지 포커스 시 자동 새로고침
const handleWindowFocus = () => {
  if (currentFundingStatus.value === 'askingPrice') {
    chartRefreshTrigger.value++
  }
}

// 페이지 가시성 변경 시 자동 새로고침
const handleVisibilityChange = () => {
  if (!document.hidden && currentFundingStatus.value === 'askingPrice') {
    chartRefreshTrigger.value++
  }
}

onMounted(() => {
  fetchFundingDetail(tradeId.value)

  // 자동 갱신을 위한 이벤트 리스너
  window.addEventListener('focus', handleWindowFocus)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', handleWindowFocus)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

watch(
  () => route.params.id,
  (newId) => {
    tradeId.value = Number(newId)
    fetchFundingDetail(tradeId.value)
    chartRefreshTrigger.value++ // 새로운 fundingId로 변경될 때도 갱신
  },
)

const handleTradeCompleted = () => {
  if (tradeHistoryChart.value) {
    tradeHistoryChart.value.fetchChartData()
  }
  chartRefreshTrigger.value++
  console.log('TradeOrderPage - chartRefreshTrigger incremented to:', chartRefreshTrigger.value)
}

const currentFundingStatus = ref('askingPrice')

// 호가 탭으로 전환할 때도 새로고침
watch(currentFundingStatus, (newStatus) => {
  if (newStatus === 'askingPrice') {
    chartRefreshTrigger.value++
  }
})
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
