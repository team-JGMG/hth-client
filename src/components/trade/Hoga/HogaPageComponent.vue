<script setup>
import { ref, nextTick } from 'vue'
import AskingPriceComponent from './AskingPriceComponent.vue'
import { mockOrderbook } from '@/utils/orderData.js'

const scrollContainer = ref(null)

const handleCenterIndex = (index) => {
  nextTick(() => {
    if (scrollContainer.value) {
      const rowHeight = 50
      const containerHeight = scrollContainer.value.clientHeight
      const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
      scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
    }
  })
}

const prices = mockOrderbook.map((item) => Number(item.price.replace(/,/g, '')))
const maxPrice = Math.max(...prices).toLocaleString()
const minPrice = Math.min(...prices).toLocaleString()
</script>

<template>
  <div class="flex flex-col items-center gap-1 mb-10">
    <div class="text-sm text-red-600 font-bold">상한가</div>
    <div class="text-base font-semibold">{{ maxPrice }} 원</div>

    <div ref="scrollContainer" class="h-[430px] overflow-y-auto no-scrollbar w-full">
      <AskingPriceComponent @centerIndex="handleCenterIndex" />
    </div>

    <div class="text-sm text-blue-600 font-bold mt-0">하한가</div>
    <div class="text-base font-semibold">{{ minPrice }} 원</div>
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
