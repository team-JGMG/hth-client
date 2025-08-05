<template>
  <!-- 썸네일 -->
  <div class="relative w-full">
    <img
      :src="item.images[currentImageIndex].photoUrl"
      class="w-full h-full object-contain"
      alt="매물 이미지"
    />
    <div class="absolute left-0 top-0 w-1/2 h-full cursor-pointer" @click="prevImage"></div>
    <div class="absolute right-0 top-0 w-1/2 h-full cursor-pointer" @click="nextImage"></div>

    <!-- 좌우 아이콘 -->
    <span
      class="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-black/30 pointer-events-none select-none"
    >
      chevron_left
    </span>
    <span
      class="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-black/30 pointer-events-none select-none"
    >
      chevron_right
    </span>
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

const router = useRouter()
const route = useRoute()

const currentTab = ref('building')
const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {}

item.images = item.images || [
  { photoUrl: '/src/assets/images/cardtestimage.png' },
  { photoUrl: '/src/assets/images/sample-buliding.png' },
  { photoUrl: '/src/assets/images/mockup.png' },
]

const currentImageIndex = ref(0)
function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + item.images.length) % item.images.length
}
function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % item.images.length
}

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

const blinkColor = ref('red') // 초기값은 빨강
let blinkInterval = null

onMounted(() => {
  const remainingDays = dDay(item.fundingEndDate)

  if (remainingDays <= 7) {
    blinkInterval = setInterval(() => {
      blinkColor.value = blinkColor.value === 'red' ? 'orange' : 'red'
    }, 500)
  }
})

onBeforeUnmount(() => {
  if (blinkInterval) clearInterval(blinkInterval)
})
</script>
