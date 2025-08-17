<template>
  <BlankLayout>
    <div class="flex flex-col h-[calc(100vh-3rem)]">
      <div class="shrink-0">
        <DetailHeader>{{ tradeItem.title }}</DetailHeader>
        <div class="bg-white pt-0">
          <CurrentPrice :currentPrice="parsedData?.currentPrice" />
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
          :parsedData="parsedData"
          :key="`orderbook-${tradeId}`"
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
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket'
import { getOrderBookByFundingId } from '@/api/orderbook'

const route = useRoute()
const tradeId = ref(Number(route.params.id))
const tradeItem = ref({})
const tradeHistoryChart = ref(null)
const parsedData = ref(null)

const fetchFundingDetail = async (id) => {
  try {
    const res = await getFundingById(id)
    tradeItem.value = res.data?.data || {}
  } catch {
    //
  }
}

function buildSeriesByCurrentPrice(buyOrders = [], sellOrders = []) {
  const map = new Map()

  buyOrders.forEach((o) => {
    if (o?.price == null) return
    const priceNum = Number(o.price)
    const qty = Number(o.quantity) || 0
    const k = String(priceNum)
    if (!map.has(k)) map.set(k, { buy: 0, sell: 0 })
    const prev = map.get(k)
    map.set(k, { ...prev, buy: (prev.buy || 0) + qty })
  })

  sellOrders.forEach((o) => {
    if (o?.price == null) return
    const priceNum = Number(o.price)
    const qty = Number(o.quantity) || 0
    const k = String(priceNum)
    if (!map.has(k)) map.set(k, { buy: 0, sell: 0 })
    const prev = map.get(k)
    map.set(k, { ...prev, sell: (prev.sell || 0) + qty })
  })

  const sortedKeys = [...map.keys()].sort((a, b) => Number(b) - Number(a))

  const prices = []
  const buyVolumes = []
  const sellVolumes = []

  for (const k of sortedKeys) {
    prices.push(Number(k))
    const v = map.get(k)
    buyVolumes.push(v.buy)
    sellVolumes.push(v.sell)
  }

  return { prices, buyVolumes, sellVolumes }
}

async function fetchOrderBookData() {
  try {
    const res = await getOrderBookByFundingId(tradeId.value)
    const payload = res?.data?.data ?? res?.data
    if (!payload || !Array.isArray(payload.buyOrders) || !Array.isArray(payload.sellOrders)) {
      return
    }

    const { prices, buyVolumes, sellVolumes } = buildSeriesByCurrentPrice(
      payload.buyOrders,
      payload.sellOrders,
    )

    parsedData.value = {
      currentPrice: payload.currentPrice,
      upperLimitPrice: payload.upperLimitPrice,
      lowerLimitPrice: payload.lowerLimitPrice,
      prices,
      buyVolumes,
      sellVolumes,
      timestamp: Date.now(),
    }
  } catch {
    //
  }
}

const { reconnect } = useOrderBookSocket(tradeId.value, (data) => {
  parsedData.value = { ...data, timestamp: Date.now() }
})

const handleWindowFocus = () => {
  if (currentFundingStatus.value === 'askingPrice') {
    fetchOrderBookData()
  }
}

const handleVisibilityChange = () => {
  if (!document.hidden && currentFundingStatus.value === 'askingPrice') {
    fetchOrderBookData()
  }
}

onMounted(() => {
  fetchFundingDetail(tradeId.value)
  fetchOrderBookData()
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
    fetchOrderBookData()
    reconnect()
  },
)

const handleTradeCompleted = () => {
  if (tradeHistoryChart.value) {
    tradeHistoryChart.value.fetchChartData()
  }
  fetchOrderBookData()
}

const currentFundingStatus = ref('askingPrice')

watch(currentFundingStatus, (newStatus) => {
  if (newStatus === 'askingPrice') {
    fetchOrderBookData()
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
