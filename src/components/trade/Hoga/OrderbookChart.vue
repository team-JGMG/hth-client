<script setup>
import { ref, nextTick, computed } from 'vue'
import AskingPriceComponent from './AskingPriceComponent.vue'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket.js'

const scrollContainer = ref(null)
const parsedData = ref(null)

// 1번 fundingId로 웹소켓 연결하고 파싱된 데이터 받아옴
useOrderBookSocket(1, (data) => {
  parsedData.value = data
})

const handleCenterIndex = (index) => {
  nextTick(() => {
    if (scrollContainer.value) {
      const rowHeight = 60
      const containerHeight = scrollContainer.value.clientHeight
      const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
      scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
    }
  })
}

// ✅ computed 써야 에러 안남
const upperLimitPrice = computed(() => parsedData.value?.upperLimitPrice || 0)
const lowerLimitPrice = computed(() => parsedData.value?.lowerLimitPrice || 0)
</script>

<template>
  <div class="flex flex-col items-center gap-1 mb-10">
    <div class="text-sm text-black font-bold">상한가</div>
    <div class="text-base text-red-500 font-semibold">
      {{ upperLimitPrice.toLocaleString() }} 원
    </div>

    <div ref="scrollContainer" class="h-[410px] overflow-y-auto no-scrollbar w-full">
      <AskingPriceComponent :parsedData="parsedData" @centerIndex="handleCenterIndex" />
    </div>

    <div class="text-base text-blue-700 font-semibold">
      {{ lowerLimitPrice.toLocaleString() }} 원
    </div>
    <div class="text-sm text-black font-bold mt-0">하한가</div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
