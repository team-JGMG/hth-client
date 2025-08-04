<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="p-4 flex items-center">
      <DetailHeader />
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 썸네일 -->
      <div class="relative w-full h-[180px] bg-gray-100">
        <img
          :src="item.images[currentImageIndex].photoUrl"
          class="w-full h-full object-contain"
          alt="매물 이미지"
        />

        <!-- 좌우 터치 영역 -->
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
      <div class="px-4 pt-3">
        <BaseTypography tag="h2" class="text-lg font-bold">{{ item.title }}</BaseTypography>
        <div class="flex items-center text-sm text-gray-500">
          <span class="mr-1"><span class="material-symbols-outlined"> location_on </span></span>
          {{ item.address }}
        </div>
      </div>

      <!-- 해시태그 -->
      <div class="px-4 mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
        <span class="bg-gray-100 px-2 py-1 rounded-full">#역세권</span>
        <span class="bg-gray-100 px-2 py-1 rounded-full">#신축</span>
        <span class="bg-gray-100 px-2 py-1 rounded-full">#고수익 기대</span>
      </div>

      <!-- 총 투자 금액 -->
      <div class="px-4 mt-4">
        <BaseTypography class="font-semibold text-xl text-base">
          총 투자 금액:
          <span class="text-black text-xl font-bold">
            {{ formatPriceInEokwon(item.price) }}
          </span>
        </BaseTypography>
      </div>

      <!-- 펀딩 진행 박스 -->
      <div class="px-4 mt-3">
        <div class="bg-white rounded-xl p-4">
          <BaseTypography class="text-sm font-semibold mb-2">펀딩 진행 현황</BaseTypography>

          <!-- 달성률 라벨 + 수치 -->
          <div class="flex justify-between items-center mb-1 text-sm">
            <span>달성률</span>
            <span class="text-indigo-600 font-semibold">{{ item.percent || 0 }}%</span>
          </div>

          <!-- 퍼센트 바 -->
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              class="h-full bg-indigo-500 transition-all duration-300"
              :style="{ width: (item.percent || 0) + '%' }"
            ></div>
          </div>

          <!-- 현재/목표 모집액 -->
          <div class="flex justify-between text-xs text-gray-700 mb-1">
            <span>현재 모집액</span>
            <span>{{ formatPriceInEokwon((item.price * (item.percent || 0)) / 100) }}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-700">
            <span>목표 모집액</span>
            <span>{{ formatPriceInEokwon(item.price) }}</span>
          </div>

          <!-- 마감일 -->
          <div class="text-xs text-red-500 mt-2 font-semibold text-right">
            모집 마감: {{ formatDate(item.fundingEndDate) }} (D-{{ dDay(item.fundingEndDate) }})
          </div>
        </div>
      </div>

      <!-- 지정가 거래 정보 박스 -->
      <div class="px-4 mt-4">
        <div class="bg-white rounded-xl p-4">
          <BaseTypography class="text-sm font-semibold mb-2">지정가 거래 정보</BaseTypography>
          <div class="flex justify-between text-sm text-gray-700">
            <span>1주당 가격</span>
            <span>{{ format(item.orderPricePerShare) }}</span>
          </div>
        </div>
      </div>

      <!-- 탭 & 세부 컴포넌트 -->
      <div class="px-4 mt-6">
        <BaseTab v-model="currentTab" :tabs="tabs" class="mb-4" />
        <component :is="tabComponent" :item="item" />
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="px-4 pt-3 pb-6 bg-white">
      <button
        @click="goToTradePage"
        class="w-full h-12 bg-black text-white rounded-[10px] font-normal text-sm tracking-tight"
      >
        거래하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseTab from '@/components/common/Tab/BaseTab.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import FundingBuildingInfo from '@/components/funding/detail/FundingBuildingInfo.vue'
import FundingInvestmentInfo from '@/components/funding/detail/FundingInvestmentInfo.vue'
import FundingFundingInfo from '@/components/funding/detail/FundingFundingInfo.vue'

import { format, formatDate, formatPriceInEokwon, dDay } from '@/utils/format'
import { mockItems } from './mockData'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: '건물 정보', value: 'building' },
  { label: '투자 정보', value: 'investment' },
  { label: '펀딩 정보', value: 'funding' },
]

const currentTab = ref('building')
const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {}

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

const goToTradePage = () => {
  const id = item.propertyId
  if (item.status === 'PENDING') {
    router.push(`/trade/${id}`)
  } else if (item.status === 'FUNDING') {
    router.push(`/funding/trade/${id}`)
  } else {
    alert('현재 거래 가능한 상태가 아닙니다.')
  }
}

const currentImageIndex = ref(0)

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + item.images.length) % item.images.length
}
function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % item.images.length
}

item.images = item.images || [
  { photoUrl: '/src/assets/images/cardtestimage.png' },
  { photoUrl: '/src/assets/images/sample-buliding.png' },
  { photoUrl: '/src/assets/images/mockup.png' },
]
</script>
