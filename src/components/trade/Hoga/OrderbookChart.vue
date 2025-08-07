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
import { ref, nextTick } from 'vue'

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
})

console.log('OrderbookChart - Received refreshTrigger:', props.refreshTrigger)

import AskingPriceComponent from './AskingPriceComponent.vue'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket.js'

const scrollContainer = ref(null)
const parsedData = ref(null)

// 1번 fundingId로 웹소켓 연결하고 파싱된 데이터 받아옴
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
