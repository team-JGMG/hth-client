<template>
  <div class="relative w-full">
    <!-- 썸네일 -->
    <div class="relative w-full h-[250px] overflow-hidden">
      <!-- 이미지 슬라이드 -->
      <transition-group :name="slideDirection" tag="div" class="relative w-full h-full">
        <img
          v-for="(img, index) in item.images"
          v-show="index === currentImageIndex"
          :key="index"
          :src="img.photoUrl"
          class="absolute top-0 left-0 w-full h-full object-contain"
          alt="매물 이미지"
        />
      </transition-group>

      <!-- 클릭 영역: 왼쪽/오른쪽 -->
      <div
        class="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10 select-none touch-manipulation"
        @click="prevImage"
      ></div>
      <div
        class="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10 select-none touch-manipulation"
        @click="nextImage"
      ></div>

      <!-- 인디케이터 (이미지 위 하단) -->
      <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
        <StepIndicator :current-step="currentImageIndex + 1" :total-steps="item.images.length" />
      </div>
    </div>
  </div>

  <!-- 제목 + 주소 -->
  <div class="pt-5">
    <BaseTypography size="xl" weight="bold" class="mb-1">{{ item.title }}</BaseTypography>
    <BaseTypography size="xs" color="gray-1" class="flex items-center text-gray-500">
      <span class="mr-1">
        <span
          class="material-symbols-rounded align-text-center relative top-[1px]"
          style="font-size: 1rem"
        >
          location_on
        </span>
      </span>
      {{ item.address }}
    </BaseTypography>
  </div>

  <!-- 해시태그 -->
  <BaseTypography size="xs" color="gray-2" class="mt-2 flex flex-wrap gap-2">
    <span class="bg-gray-100 px-2 py-1 rounded-full">#역세권</span>
    <span class="bg-gray-100 px-2 py-1 rounded-full">#신축</span>
    <span class="bg-gray-100 px-2 py-1 rounded-full">#고수익 기대</span>
  </BaseTypography>

  <!-- 총 투자 금액 -->
  <div class="mt-4 flex items-baseline gap-1 mb-4">
    <BaseTypography size="lg" weight="bold"> 총 투자 금액: </BaseTypography>
    <BaseTypography size="lg" weight="bold">
      {{ formatPriceInEokwon(item.price) }}
    </BaseTypography>
  </div>

  <!-- 펀딩 진행 박스 -->
  <BaseCard class="h-auto flex flex-col mb-2">
    <div class="bg-white rounded-xl">
      <BaseTypography size="base" weight="bold" class="mb-2">펀딩 진행 현황</BaseTypography>
      <div class="mt-4 flex justify-between gap-1 mb-2">
        <BaseTypography size="sm" class="items-center mb-1"> 달성률</BaseTypography>
        <BaseTypography color="blue" weight="bold" size="sm"
          >{{ item.percent || 0 }}%</BaseTypography
        >
      </div>

      <div class="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          class="h-full bg-blue-600 transition-all duration-300"
          :style="{ width: (item.percent || 0) + '%' }"
        ></div>
      </div>
      <BaseTypography color="gray-1" size="xs" class="flex justify-between mb-1">
        현재 모집액
        <span>{{ formatPriceInEokwon((item.price * (item.percent || 0)) / 100) }}</span>
      </BaseTypography>
      <BaseTypography color="gray-1" size="xs" class="flex justify-between mb-1">
        <span>목표 모집액</span>
        <span>{{ formatPriceInEokwon(item.price) }}</span>
      </BaseTypography>
      <BaseTypography
        size="xs"
        weight="bold"
        class="mt-2 text-right transition-colors duration-300"
        :style="{ color: blinkColor }"
      >
        모집 마감: {{ formatDate(item.fundingEndDate) }} (D-{{ dDay(item.fundingEndDate) }})
      </BaseTypography>
    </div>
  </BaseCard>

  <!-- 지정가 거래 정보 -->
  <BaseCard class="h-auto flex flex-col">
    <div class="bg-white rounded-xl">
      <BaseTypography size="base" weight="bold" class="mb-2">지정가 거래 정보</BaseTypography>
      <div class="flex justify-between text-sm text-gray-700">
        <BaseTypography size="sm" class="items-center mb-1">1주당 가격</BaseTypography>
        <BaseTypography size="sm" class="items-center mb-1"
          >{{ format(item.orderPricePerShare) }}원</BaseTypography
        >
      </div>
    </div></BaseCard
  >

  <!-- 탭 -->
  <div class="mt-8 pb-48">
    <BaseTab v-model="currentTab" :tabs="tabs" class="mb-4" />
    <component :is="tabComponent" :item="item" />
  </div>

  <!-- 하단 버튼 -->
  <CompletedButton
    :color="black"
    :text-color="white"
    class="w-full max-w-[340px] fixed bottom-20 left-1/2 transform -translate-x-1/2"
    @click="goToTradePage"
  >
    펀딩하기
  </CompletedButton>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseTab from '@/components/common/Tab/BaseTab.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import FundingBuildingInfo from './tabSection/tab/FundingBuildingInfo.vue'
import FundingInvestmentInfo from './tabSection/tab/FundingInvestmentInfo.vue'
import FundingFundingInfo from './tabSection/tab/FundingFundingInfo.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'

import { format, formatDate, formatPriceInEokwon, dDay } from '@/utils/format'
import { mockItems } from '@/pages/funding/mockData'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import StepIndicator from '@/components/onboarding/StepIndicator.vue'

const router = useRouter()
const route = useRoute()

const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {}

item.images = item.images || [
  { photoUrl: '/src/assets/images/cardtestimage.png' },
  { photoUrl: '/src/assets/images/sample-buliding.png' },
  { photoUrl: '/src/assets/images/mockup.png' },
]

const currentImageIndex = ref(0)
const slideDirection = ref('slide-right')

let interval = null
function startAutoSlide() {
  interval = setInterval(() => {
    slideDirection.value = 'slide-right'
    currentImageIndex.value = (currentImageIndex.value + 1) % item.images.length
  }, 3000)
}

function stopAutoSlide() {
  if (interval) clearInterval(interval)
}

function restartAutoSlide() {
  stopAutoSlide()
  startAutoSlide()
}

function prevImage() {
  slideDirection.value = 'slide-left'
  currentImageIndex.value = (currentImageIndex.value - 1 + item.images.length) % item.images.length
  restartAutoSlide()
}

function nextImage() {
  slideDirection.value = 'slide-right'
  currentImageIndex.value = (currentImageIndex.value + 1) % item.images.length
  restartAutoSlide()
}

onMounted(() => {
  startAutoSlide()

  // 펀딩 마감 D-7 이하이면 색상 깜빡임 시작
  const remainingDays = dDay(item.fundingEndDate)
  if (remainingDays <= 7) {
    blinkInterval = setInterval(() => {
      blinkColor.value = blinkColor.value === 'red' ? 'orange' : 'red'
    }, 500)
  }
})

onBeforeUnmount(() => {
  stopAutoSlide()
  if (blinkInterval) clearInterval(blinkInterval)
})

const currentTab = ref('building')
const tabs = [
  { label: '건물 정보', value: 'building' },
  { label: '투자 정보', value: 'investment' },
  { label: '펀딩 정보', value: 'funding' },
]

const tabComponent = computed(() => {
  switch (currentTab.value) {
    case 'building':
      return FundingBuildingInfo
    case 'investment':
      return FundingInvestmentInfo
    case 'funding':
      return FundingFundingInfo
    default:
      return FundingBuildingInfo
  }
})

function goToTradePage() {
  const id = item.propertyId
  if (item.status === 'PENDING') {
    router.push(`/trade/${id}`)
  } else if (item.status === 'FUNDING') {
    router.push(`/funding/trade/${id}`)
  } else {
    alert('현재 거래 가능한 상태가 아닙니다.')
  }
}

const blinkColor = ref('red')
let blinkInterval = null
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease-in-out;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

div {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
