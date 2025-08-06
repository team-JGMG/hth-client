<!-- MyInvestments.vue -->
<script setup>
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from '@/components/account/CancelConfirmModal.vue'

import NoInvestmentItems from './NoInvestmentItems.vue'

import { ref } from 'vue'
import DividendModal from './DividendModal.vue'

const isDividendModalOpen = ref(false)
const selectedBuildingName = ref('')
const selectedDividends = ref([])

// 예시 배당금 데이터 (나중에 item에서 불러올 수도 있음)
const dummyDividendData = [
  { date: '07.14 11:11', amount: 250 },
  { date: '06.14 11:11', amount: 250 },
  { date: '05.14 11:11', amount: 250 },
  { date: '04.14 11:11', amount: 250 },
]

const openDividendModal = (buildingName) => {
  selectedBuildingName.value = buildingName
  selectedDividends.value = dummyDividendData // 또는 실제 데이터
  isDividendModalOpen.value = true
}
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
const confirmCancel = () => {
  closeModal()
}

const trades = [
  {
    name: '63빌딩 초고층 6301호',
    percent: 63,
    left: 1_550,
    total: 7_750_000,
    img: '/src/assets/images/sample-buliding.png',
    status: '펀딩 중',
  },
  {
    name: '63빌딩 초고층 6301호',
    ownedAmount: 6,
    avgPrice: 5300,
    img: '/src/assets/images/sample-buliding.png',
    status: '보유 중',
    price: 5550,
  },
  {
    name: '63빌딩 초고층 6308호',
    ownedAmount: 5,
    img: '/src/assets/images/sample-buliding.png',
    status: '거래 대기',
    price: 4800,
  },
  {
    name: '63빌딩 초고층 6301호',
    percent: 63,
    left: 1_550,
    total: 7_750_000,
    img: '/src/assets/images/sample-buliding.png',
    status: '펀딩 중',
  },
  {
    name: '63빌딩 초고층 6301호',
    ownedAmount: 6,
    avgPrice: 5300,
    img: '/src/assets/images/sample-buliding.png',
    status: '보유 중',
    price: 5550,
  },
  {
    name: '63빌딩 초고층 6308호',
    ownedAmount: 5,
    img: '/src/assets/images/sample-buliding.png',
    status: '거래 대기',
    price: 4800,
  },
  {
    name: '63빌딩 초고층 6301호',
    percent: 63,
    left: 1_550,
    total: 7_750_000,
    img: '/src/assets/images/sample-buliding.png',
    status: '펀딩 중',
  },
  {
    name: '63빌딩 초고층 6301호',
    ownedAmount: 6,
    avgPrice: 5300,
    img: '/src/assets/images/sample-buliding.png',
    status: '보유 중',
    price: 5550,
  },
  {
    name: '63빌딩 초고층 6308호',
    ownedAmount: 5,
    img: '/src/assets/images/sample-buliding.png',
    status: '거래 대기',
    price: 4800,
  },
  {
    name: '63빌딩 초고층 6301호',
    percent: 100,
    left: 0,
    total: 7_750_000,
    img: '/src/assets/images/sample-buliding.png',
    status: '펀딩 만료', // ✅ 추가
  },
]
const fundingItems = trades.filter((t) => t.status === '펀딩 중' || t.status === '펀딩 만료')
const ownedItems = trades.filter((t) => t.status === '보유 중')

const waitingItems = trades.filter((t) => t.status === '거래 대기')
</script>

<template>
  <NoInvestmentItems v-if="!fundingItems.length && !ownedItems.length && !waitingItems.length" />

  <!-- 펀딩 중인 매물 -->
  <div v-if="fundingItems.length" class="space-y-2 mb-6">
    <BaseTypography size="lg" weight="bold" class="mt-6 mb-2">펀딩 중인 매물</BaseTypography>

    <div
      v-for="(item, idx) in fundingItems"
      :key="idx"
      class="flex justify-between bg-white rounded-lg border px-3 py-2"
    >
      <div class="flex items-center">
        <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
        <div>
          <BaseTypography size="sm" weight="semibold">
            {{ item.name }}
          </BaseTypography>
          <BaseTypography size="xs" color="gray-1" class="mt-1">10주 보유</BaseTypography>

          <div class="flex items-center mt-1">
            <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-500 transition-all duration-300"
                :style="{ width: item.percent + '%' }"
              ></div>
            </div>
            <BaseTypography size="xs" weight="black" class="!text-indigo-500 ml-2">
              {{ item.percent }}%
            </BaseTypography>
          </div>

          <BaseTypography size="xs" color="gray-1" class="mt-1">
            남은 주(금액): <br />
            {{ item.left.toLocaleString() }}주 ({{ item.total.toLocaleString() }}원)
          </BaseTypography>
        </div>
      </div>
      <div class="flex flex-col justify-between items-end ml-2 h-full">
        <div class="h-14"></div>

        <!-- ✅ 상태 분기 -->
        <BaseButton
          v-if="item.status === '펀딩 만료'"
          disabled
          class="text-xs bg-gray-300 text-white rounded-md px-3 py-2 cursor-not-allowed"
        >
          <BaseTypography color="white" size="xs" weight="medium">기간만료</BaseTypography>
        </BaseButton>

        <BaseButton
          v-else-if="item.status === '펀딩 중'"
          @click="openModal"
          variant="danger"
          class="text-xs text-white rounded-md hover:bg-[#e63232] transition-colors duration-150"
        >
          <BaseTypography size="xs" weight="medium" color="white">취소하기</BaseTypography>
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- 보유중인 매물 -->
  <div v-if="ownedItems.length" class="space-y-2 mb-6">
    <BaseTypography size="lg" weight="bold" class="mt-6 mb-2">보유중인 매물</BaseTypography>

    <div
      v-for="(item, idx) in ownedItems"
      :key="idx"
      class="flex justify-between bg-white rounded-lg border px-3 py-2"
    >
      <div class="flex items-center">
        <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
        <div>
          <BaseTypography size="sm" weight="semibold">{{ item.name }}</BaseTypography>
          <BaseTypography size="xs" color="gray-1" class="mt-1">
            보유 주 수량: {{ item.ownedAmount }}주
          </BaseTypography>
          <BaseTypography size="xs" color="gray-1">
            평단가: {{ item.avgPrice.toLocaleString() }}원
          </BaseTypography>
        </div>
      </div>

      <div class="flex flex-col justify-between items-end ml-2 h-full">
        <BaseTypography size="xs" color="gray-1">현재 시세</BaseTypography>
        <BaseTypography weight="medium" size="base" color="red">
          {{ item.price.toLocaleString() }}원 </BaseTypography
        ><!-- ✅ 나의 배당금 버튼 -->
        <BaseButton
          variant="secondary"
          @click="openDividendModal(item.name)"
          class="text-xs px-0.5 mb-1 !py-0.5"
        >
          <BaseTypography color="white" weight="medium" class="text-[11px]">
            내 배당금
          </BaseTypography>
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- 거래 대기 중인 매물 -->
  <div v-if="waitingItems.length" class="space-y-2 mb-6">
    <BaseTypography size="lg" weight="bold" class="mt-6 mb-2">거래 대기 중인 매물</BaseTypography>

    <div
      v-for="(item, idx) in waitingItems"
      :key="idx"
      class="flex justify-between bg-white rounded-lg border px-3 py-2"
    >
      <div class="flex items-center">
        <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
        <div>
          <BaseTypography size="sm" weight="semibold">{{ item.name }}</BaseTypography>
          <BaseTypography size="xs" color="gray-1" class="mt-1">
            판매 대기 수량: {{ item.ownedAmount }}주
          </BaseTypography>
        </div>
      </div>

      <div class="flex flex-col justify-between items-end ml-2 h-full">
        <div class="text-right w-full">
          <BaseTypography size="xs" color="gray-1" class="text-right">호가</BaseTypography>
          <BaseTypography weight="medium" size="base" color="red" class="text-right">
            {{ item.price.toLocaleString() }}원
          </BaseTypography>
        </div>

        <BaseButton
          @click="openModal"
          variant="danger"
          class="text-xs text-white rounded-md hover:bg-[#e63232] transition-colors duration-150"
        >
          <BaseTypography size="xs" weight="medium" color="white">취소하기</BaseTypography>
        </BaseButton>
      </div>
    </div>
  </div>

  <DividendModal
    :isOpen="isDividendModalOpen"
    :buildingName="selectedBuildingName"
    :dividends="selectedDividends"
    @close="isDividendModalOpen = false"
  />
  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>
