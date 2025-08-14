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
import { ref, nextTick, onMounted, toRefs } from 'vue'
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

// ✅ 가격 단일 축(내림차순) + 양쪽 볼륨을 같은 인덱스로 맞추기
function buildMergedSeries(buyOrders = [], sellOrders = []) {
  const map = new Map() // key: price(string), value: { buy: number, sell: number }

  const add = (arr, key) => {
    arr.forEach((o) => {
      if (o?.price === null || o?.price === undefined) return
      const k = String(o.price) // 표시 값은 보존, 정렬은 Number로만
      if (!map.has(k)) map.set(k, { buy: 0, sell: 0 })
      const prev = map.get(k)
      map.set(k, { ...prev, [key]: (prev[key] || 0) + (Number(o.quantity) || 0) })
    })
  }

  add(buyOrders, 'buy')
  add(sellOrders, 'sell')

  const sortedKeys = [...map.keys()].sort((a, b) => Number(b) - Number(a)) // 전체 내림차순

  const prices = []
  const buyVolumes = []
  const sellVolumes = []

  for (const k of sortedKeys) {
    prices.push(isNaN(Number(k)) ? k : Number(k)) // 숫자면 숫자로 노출
    const v = map.get(k)
    buyVolumes.push(v.buy)
    sellVolumes.push(v.sell)
  }
  return { prices, buyVolumes, sellVolumes }
}

onMounted(async () => {
  try {
    const res = await getOrderBookByFundingId(fundingId.value)
    const payload = res?.data?.data ?? res?.data
    if (!payload || !Array.isArray(payload.buyOrders) || !Array.isArray(payload.sellOrders)) {
      console.warn('⛔ 불완전한 초기 호가 데이터:', payload)
      return
    }

    const { prices, buyVolumes, sellVolumes } = buildMergedSeries(
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
    }

    // 디버깅: 길이 확인 (필요시)
    // console.log(prices.length, buyVolumes.length, sellVolumes.length)
  } catch (e) {
    console.error('초기 호가 REST 데이터 로딩 실패:', e)
  }
})

// 이후 실시간 WebSocket 업데이트
useOrderBookSocket(fundingId.value, (data) => {
  const payload = data?.data ?? data
  if (!payload || !Array.isArray(payload.buyOrders) || !Array.isArray(payload.sellOrders)) {
    console.warn('⛔ 불완전한 실시간 호가 데이터:', payload)
    return
  }

  const { prices, buyVolumes, sellVolumes } = buildMergedSeries(
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
  }
})

const handleCenterIndex = (index, prices) => {
  nextTick(() => {
    if (scrollContainer.value) {
      const containerHeight = scrollContainer.value.clientHeight
      const rowHeight = containerHeight / prices.length
      const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
      scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
    }
  })
}
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
