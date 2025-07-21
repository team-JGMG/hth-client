<template>
  <div class="px-4 mb-20">
    <BaseTypography class="text-xl font-medium mb-4">매각 완료</BaseTypography>
    <div
      ref="cardContainer"
      class="card-container overflow-x-auto flex space-x-4 pb-2"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="doDrag"
      @touchstart="startTouch"
      @touchmove="doTouchMove"
      @touchend="stopDrag"
    >
      <div class="card-item w-32 flex-shrink-0">
        <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
          <BaseCard
            class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-50"
          ></BaseCard>
          <div class="relative">
            <div class="text-xs opacity-75 mb-2">아파트</div>
            <div class="text-lg font-bold">+78%</div>
          </div>
        </div>
      </div>
      <div class="card-item w-32 flex-shrink-0">
        <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-50"
          ></div>
          <div class="relative">
            <div class="text-xs opacity-75 mb-2">투자 수익률</div>
            <div class="text-lg font-bold">+9.72%</div>
          </div>
        </div>
      </div>
      <div class="card-item w-32 flex-shrink-0">
        <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-50"
          ></div>
          <div class="relative">
            <div class="text-xs opacity-75 mb-2">투자 수익률</div>
            <div class="text-lg font-bold">+5.50%</div>
          </div>
        </div>
      </div>
      <div class="card-item w-32 flex-shrink-0">
        <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-50"></div>
          <div class="relative">
            <div class="text-xs opacity-75 mb-2">오피스텔</div>
            <div class="text-lg font-bold">+12.3%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const cardContainer = ref(null)
let isDragging = false
let startX
let scrollLeft

const startDrag = (e) => {
  isDragging = true
  startX = e.pageX - cardContainer.value.offsetLeft
  scrollLeft = cardContainer.value.scrollLeft
  cardContainer.value.style.cursor = 'grabbing'
}

const stopDrag = () => {
  isDragging = false
  cardContainer.value.style.cursor = 'grab'
}

const doDrag = (e) => {
  if (!isDragging) return
  e.preventDefault()
  const x = e.pageX - cardContainer.value.offsetLeft
  const walk = (x - startX) * 2 // Adjust scroll speed
  cardContainer.value.scrollLeft = scrollLeft - walk
}

const startTouch = (e) => {
  isDragging = true
  startX = e.touches[0].pageX - cardContainer.value.offsetLeft
  scrollLeft = cardContainer.value.scrollLeft
}

const doTouchMove = (e) => {
  if (!isDragging) return
  const x = e.touches[0].pageX - cardContainer.value.offsetLeft
  const walk = (x - startX) * 2
  cardContainer.value.scrollLeft = scrollLeft - walk
}
</script>

<style scoped>
.card-container {
  -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
  cursor: grab;
}
</style>
