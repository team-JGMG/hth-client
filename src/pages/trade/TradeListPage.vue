<!-- 거래 목록 페이지 -->
<!-- <template>TradeListPage</template>
<script setup></script> -->
<template>
  <div class="max-w-md mx-auto bg-white min-h-screen">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">D</span>
        </div>
        <div class="w-8 h-8 bg-purple-300 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">A</span>
        </div>
      </div>
    </div>

    <div class="px-4 mb-6">
      <div class="bg-black rounded-2xl p-6 text-white">
        <div class="text-sm opacity-75 mb-1">이지뱅님</div>
        <div class="text-lg font-medium mb-4">보유 포인트</div>
        <div class="text-3xl font-bold mb-6">60,000원</div>
        <div class="flex space-x-3 mb-4">
          <button class="flex-1 bg-green-400 text-black py-3 rounded-xl font-medium">
            포인트 충전
          </button>
          <button class="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-medium">
            포인트 환급
          </button>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span>포인트 관리하러 가기</span>
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>

    <div class="px-4 space-y-4 mb-6">
      <div
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div>
          <div class="font-medium text-gray-900 mb-1">지금 바로 받아볼 수 있는 다양한</div>
          <div class="text-yellow-600 font-medium">투자 배당금 탐색해보세요!</div>
        </div>
        <i class="fas fa-chevron-right text-gray-400"></i>
      </div>
      <div
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div>
          <div class="font-medium text-gray-900 mb-1">거래 중인 매물, 실시간으로</div>
          <div class="text-yellow-600 font-medium">관리하세요!</div>
        </div>
        <i class="fas fa-chevron-right text-gray-400"></i>
      </div>
      <div
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div>
          <div class="font-medium text-gray-900 mb-1">보유 매물을 등록하고</div>
          <div class="font-medium text-gray-900">새로운 거치료 만들어 보세요!</div>
        </div>
        <i class="fas fa-chevron-right text-gray-400"></i>
      </div>
    </div>

    <div class="px-4 mb-4">
      <div class="flex justify-between items-center mb-4">
        <div>
          <div class="text-sm text-gray-600">건물주가 되어 받는</div>
          <div class="font-medium text-gray-900">
            임대 수익 <i class="fas fa-home text-yellow-500"></i>
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-600">건물 가격 상승세에 따는</div>
          <div class="font-medium text-gray-900">
            시세 차익 <i class="fas fa-chart-line text-blue-500"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 mb-6">
      <div class="text-lg font-medium mb-4">매각 완료</div>
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
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-50"
            ></div>
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
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-50"
            ></div>
            <div class="relative">
              <div class="text-xs opacity-75 mb-2">오피스텔</div>
              <div class="text-lg font-bold">+12.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black text-white"
    >
      <div class="flex items-center justify-around py-3">
        <div class="flex flex-col items-center space-y-1">
          <i class="fas fa-home text-lg"></i>
          <span class="text-xs">홈</span>
        </div>
        <div class="flex flex-col items-center space-y-1 opacity-60">
          <i class="fas fa-search text-lg"></i>
          <span class="text-xs">찾기</span>
        </div>
        <div class="flex flex-col items-center space-y-1 opacity-60">
          <i class="fas fa-chart-bar text-lg"></i>
          <span class="text-xs">자산</span>
        </div>
        <div class="flex flex-col items-center space-y-1 opacity-60">
          <i class="fas fa-user text-lg"></i>
          <span class="text-xs">내정보</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cardContainer = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const startDrag = (e) => {
  isDragging.value = true
  startX.value = e.pageX - cardContainer.value.offsetLeft
  scrollLeft.value = cardContainer.value.scrollLeft
  // Prevent text selection during drag
  cardContainer.value.style.cursor = 'grabbing'
}

const stopDrag = () => {
  isDragging.value = false
  cardContainer.value.style.cursor = 'grab'
}

const doDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault() // Prevent default browser drag behavior
  const x = e.pageX - cardContainer.value.offsetLeft
  const walk = (x - startX.value) * 2 // Adjust scroll speed
  cardContainer.value.scrollLeft = scrollLeft.value - walk
}

// Touch events for mobile
const startTouch = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX - cardContainer.value.offsetLeft
  scrollLeft.value = cardContainer.value.scrollLeft
}

const doTouchMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault() // Prevent vertical scrolling
  const x = e.touches[0].clientX - cardContainer.value.offsetLeft
  const walk = (x - startX.value) * 2
  cardContainer.value.scrollLeft = scrollLeft.value - walk
}
</script>

<style scoped>
.card-container {
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Add cursor for visual feedback */
  cursor: grab;
}

.card-container::-webkit-scrollbar {
  display: none;
}

.card-item {
  scroll-snap-align: start;
  flex: none;
}
</style>
