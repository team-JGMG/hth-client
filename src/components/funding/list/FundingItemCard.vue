<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
    <div
      v-for="item in filteredList"
      :key="item.id"
      class="relative w-full border rounded-xl overflow-hidden shadow-sm bg-white"
    >
      <!-- 상태 뱃지 -->
      <div
        class="absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold rounded-md text-white"
        :class="getBadgeColor(item.status)"
      >
        {{ item.status }}
      </div>

      <img :src="item.image || testImage" alt="펀딩 이미지" class="w-full h-[120px] object-cover" />

      <!-- 매각 완료 오버레이 -->
      <div
        v-if="item.status === '매각 완료'"
        class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-0"
      >
        <div class="text-white text-lg font-bold mb-1">매각 완료</div>
        <div class="text-white text-sm">누적 수익률</div>
        <div class="text-white text-sm">
          {{ item.yield > 0 ? '+' : item.yield < 0 ? '' : '' }}{{ item.yield?.toFixed(2) }}%
        </div>
      </div>

      <div class="p-3">
        <BaseTypography class="text-sm font-semibold text-gray-800">{{
          item.title
        }}</BaseTypography>
        <BaseTypography class="text-[10px] text-gray-500 mt-0.5">{{
          item.subtitle
        }}</BaseTypography>

        <div class="flex flex-wrap gap-1 mt-1 mb-2">
          <span class="bg-gray-100 text-[10px] text-gray-600 px-2 py-0.5 rounded-full"
            >#수익형</span
          >
          <span class="bg-gray-100 text-[10px] text-gray-600 px-2 py-0.5 rounded-full">#투자</span>
        </div>

        <div class="flex justify-between items-center mb-1">
          <BaseTypography class="text-xs font-bold text-gray-800">{{ item.amount }}</BaseTypography>
          <BaseTypography
            class="text-[10px] font-medium"
            :class="item.percent === 100 ? 'text-red-500' : 'text-blue-600'"
            >{{ item.percent }}%</BaseTypography
          >
        </div>

        <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500"
            :class="item.percent === 100 ? 'bg-red-500' : 'bg-blue-600'"
            :style="{ width: item.percent + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import testImage from '@/assets/images/cardtestimage.png'

const props = defineProps({
  status: String, // '모집 중', '펀딩 완료', '매각 완료' or undefined(전체)
})

const fundingList = [
  {
    id: 1,
    status: '모집 중',
    title: '63빌딩 6301호',
    subtitle: '서울 영등포구 여의도동',
    amount: '10억원',
    percent: 63,
    image: '',
    yield: null,
  },
  {
    id: 2,
    status: '펀딩 완료',
    title: '삼성타워 502호',
    subtitle: '서울시 강남구 삼성동',
    amount: '15억원',
    percent: 100,
    image: '',
    yield: null,
  },
  {
    id: 3,
    status: '매각 완료',
    title: '강남파이낸스센터 1702호',
    subtitle: '서울 강남구 역삼동',
    amount: '18억원',
    percent: 100,
    image: '',
    yield: 5.5,
  },
  {
    id: 4,
    status: '매각 완료',
    title: '판교테크노밸리 301호',
    subtitle: '경기도 성남시 분당구',
    amount: '22억원',
    percent: 100,
    image: '',
    yield: 7.2,
  },
  {
    id: 5,
    status: '모집 중',
    title: '상암DMC타워 801호',
    subtitle: '서울 마포구 상암동',
    amount: '9억원',
    percent: 45,
    image: '',
    yield: null,
  },
  {
    id: 6,
    status: '펀딩 완료',
    title: '강서N타워 101호',
    subtitle: '서울 강서구 등촌동',
    amount: '11억원',
    percent: 100,
    image: '',
    yield: null,
  },
  {
    id: 7,
    status: '매각 완료',
    title: '서초타워 1202호',
    subtitle: '서울 서초구 서초동',
    amount: '25억원',
    percent: 100,
    image: '',
    yield: -1.5,
  },
  {
    id: 8,
    status: '매각 완료',
    title: '종로센터 401호',
    subtitle: '서울 종로구 종로2가',
    amount: '8억원',
    percent: 100,
    image: '',
    yield: 0,
  },
]

const filteredList = computed(() => {
  if (!props.status) return fundingList
  return fundingList.filter((item) => item.status === props.status)
})

function getBadgeColor(status) {
  switch (status) {
    case '모집 중':
      return 'bg-green-500'
    case '펀딩 완료':
      return 'bg-red-500'
    case '매각 완료':
      return 'bg-black'
    default:
      return 'bg-gray-400'
  }
}
</script>
