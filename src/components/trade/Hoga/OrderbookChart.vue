<template>
  <div ref="scrollContainer" class="overflow-y-auto no-scrollbar w-full">
    <AskingPriceComponent
      v-if="parsedData"
      :parsedData="parsedData"
      @centerIndex="handleCenterIndex"
      :refreshTrigger="props.refreshTrigger"
      :fundingId="fundingId"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, toRefs, watch } from 'vue'
import AskingPriceComponent from './AskingPriceComponent.vue'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket'
import { getOrderBookByFundingId } from '@/api/orderbook'

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
  fundingId: { type: Number, required: true },
})
const { fundingId } = toRefs(props)

const scrollContainer = ref(null)
const parsedData = ref(null)

// 웹소켓 훅 사용 (소켓쪽은 이미 정규화되어 온다고 가정)
const { reconnect } = useOrderBookSocket(fundingId.value, (data) => {
  console.log('🔥 웹소켓 데이터 수신 및 parsedData 업데이트')
  parsedData.value = { ...data, timestamp: Date.now() }
})

/**
 * currentPrice 기준으로 매수/매도 재분류하고
 * 가격을 내림차순으로 정렬하여 시리즈 생성
 */
function buildSeriesByCurrentPrice(buyOrders = [], sellOrders = [], currentPrice) {
  const map = new Map()
  const all = [...buyOrders, ...sellOrders]

  all.forEach((o) => {
    if (o?.price == null) return
    const priceNum = Number(o.price)
    const qty = Number(o.quantity) || 0
    const k = String(priceNum)

    if (!map.has(k)) map.set(k, { buy: 0, sell: 0 })

    // currentPrice보다 낮으면 매수, 높으면 매도, 같으면 매도로 처리
    const side =
      priceNum < Number(currentPrice) ? 'buy' : priceNum > Number(currentPrice) ? 'sell' : 'sell'

    const prev = map.get(k)
    map.set(k, { ...prev, [side]: (prev[side] || 0) + qty })
  })

  // 가격 내림차순 (큰 값이 위)
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
    console.log('📡 REST API 호출 중...', new Date().toLocaleTimeString())
    const res = await getOrderBookByFundingId(fundingId.value)
    const payload = res?.data?.data ?? res?.data
    if (!payload || !Array.isArray(payload.buyOrders) || !Array.isArray(payload.sellOrders)) {
      console.warn('⛔ 불완전한 호가 데이터:', payload)
      return
    }

    // 🔁 서버에서 buy/sell이 뒤바뀌어 온다고 하셨으니 스왑해서 전달
    const { prices, buyVolumes, sellVolumes } = buildSeriesByCurrentPrice(
      payload.sellOrders, // 실제 매도
      payload.buyOrders, // 실제 매수
      payload.currentPrice,
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

    console.log('✅ REST API 데이터 갱신 완료:', new Date().toLocaleTimeString())
  } catch (e) {
    console.error('❌ REST API 호가 데이터 로딩 실패:', e)
  }
}

// 페이지 포커스/가시화 시 갱신
const handleFocus = () => fetchOrderBookData()
const handleVisibilityChange = () => {
  if (!document.hidden) fetchOrderBookData()
}

// 수동 재연결
const manualReconnect = () => {
  console.log('🔄 수동 재연결 요청')
  reconnect()
  fetchOrderBookData()
}

onMounted(() => {
  fetchOrderBookData()
  window.addEventListener('focus', handleFocus)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', handleFocus)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 외부 트리거/종목 변경 시 갱신
watch(
  () => props.refreshTrigger,
  (n, o) => {
    if (n !== o) fetchOrderBookData()
  },
)
watch(fundingId, (n, o) => {
  if (n !== o) fetchOrderBookData()
})

const handleCenterIndex = (index, prices) => {
  nextTick(() => {
    if (!scrollContainer.value) return
    const containerHeight = scrollContainer.value.clientHeight
    const rowHeight = containerHeight / prices.length
    const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
    scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
  })
}

defineExpose({ fetchOrderBookData, manualReconnect })
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
