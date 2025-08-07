<template>
  <div ref="scrollContainer" class="overflow-y-auto no-scrollbar w-full">
    <AskingPriceComponent
      :parsedData="parsedData"
      @centerIndex="handleCenterIndex"
      :refreshTrigger="props.refreshTrigger"
    />
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted } from 'vue'

import AskingPriceComponent from './AskingPriceComponent.vue'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket'
import { getOrderBookByFundingId } from '@/api/orderbook'

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
})

const scrollContainer = ref(null)
const parsedData = ref(null)

onMounted(async () => {
  try {
    const res = await getOrderBookByFundingId(1)
    const data = res.data

    if (!data || !Array.isArray(data.buyOrders) || !Array.isArray(data.sellOrders)) {
      console.warn('⛔ 불완전한 초기 호가 데이터:', data)
      return
    }

    const buyOrders = data.buyOrders
    const sellOrders = data.sellOrders

    parsedData.value = {
      currentPrice: data.currentPrice,
      upperLimitPrice: data.upperLimitPrice,
      lowerLimitPrice: data.lowerLimitPrice,
      prices: [...buyOrders.map((o) => o.price), ...sellOrders.map((o) => o.price)],
      buyVolumes: buyOrders.map((o) => o.quantity),
      sellVolumes: sellOrders.map((o) => o.quantity),
    }
  } catch (e) {
    console.error('초기 호가 REST 데이터 로딩 실패:', e)
  }
})

// 이후 실시간은 WebSocket으로 덮어쓰기
useOrderBookSocket(1, (data) => {
  parsedData.value = data
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
