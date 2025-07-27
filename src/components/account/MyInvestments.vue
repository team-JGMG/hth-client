<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from '@/components/account/CancelConfirmModal.vue'

import { ref } from 'vue'

import NoInvestmentItems from './NoInvestmentItems.vue'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
const confirmCancel = () => {
  // 실제 취소 로직 실행
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
]

const fundingItems = trades.filter((t) => t.status === '펀딩 중')
const ownedItems = trades.filter((t) => t.status === '보유 중')
const waitingItems = trades.filter((t) => t.status === '거래 대기')
</script>
<template>
  <div class="p-4 min-h-[600px]">
    <NoInvestmentItems v-if="!fundingItems.length && !ownedItems.length && !waitingItems.length" />

    <!-- 펀딩 중인 매물 -->
    <div v-if="fundingItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">펀딩 중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in fundingItems"
        :key="idx"
        class="flex justify-between bg-white rounded-lg border px-3 py-2"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">
              {{ item.name }}
            </BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1">10주 보유</BaseTypography>

            <div class="flex items-center mt-1">
              <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-500 transition-all duration-300"
                  :style="{ width: item.percent + '%' }"
                ></div>
              </div>
              <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                {{ item.percent }}%
              </BaseTypography>
            </div>

            <BaseTypography class="text-xs !text-gray-500 mt-1">
              남은 주(금액): {{ item.left.toLocaleString() }} / {{ item.total.toLocaleString() }}원
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <div class="h-14"></div>
          <button
            @click="openModal"
            class="text-xs bg-[#ff3b3b] text-white rounded-md px-3 py-1 hover:bg-[#e63232] transition-colors duration-150"
          >
            <BaseTypography class="text-xs font-medium !text-white">취소하기</BaseTypography>
          </button>
        </div>
      </div>
    </div>

    <!-- 보유중인 매물 -->
    <div v-if="ownedItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">보유중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in ownedItems"
        :key="idx"
        class="flex justify-between bg-white rounded-lg border px-3 py-2"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">{{
              item.name
            }}</BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1">
              보유 주 수량: {{ item.ownedAmount }}주
            </BaseTypography>
            <BaseTypography class="text-xs !text-gray-400 mt-0.5">
              평단가: {{ item.avgPrice.toLocaleString() }}원
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <BaseTypography class="text-xs text-gray-500 mb-0.5">현재 시세</BaseTypography>
          <BaseTypography class="text-base font-semibold" style="color: #ff3b3b">
            {{ item.price.toLocaleString() }}원
          </BaseTypography>
        </div>
      </div>
    </div>

    <!-- 거래 대기 중인 매물 -->
    <div v-if="waitingItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">거래 대기 중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in waitingItems"
        :key="idx"
        class="flex justify-between bg-white rounded-lg border px-3 py-2"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">{{
              item.name
            }}</BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1">
              판매 대기 수량: {{ item.ownedAmount }}주
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <div class="text-right w-full">
            <BaseTypography class="text-xs text-gray-500 mb-0.5 text-right">호가</BaseTypography>
            <BaseTypography class="text-base font-semibold !text-[#ff3b3b] text-right">
              {{ item.price.toLocaleString() }}원
            </BaseTypography>
          </div>

          <button
            @click="openModal"
            class="mt-2 text-xs bg-[#ff3b3b] text-white rounded-md px-3 py-1 hover:bg-[#e63232] transition-colors duration-150"
          >
            <BaseTypography class="text-xs font-medium !text-white">취소하기</BaseTypography>
          </button>
        </div>
      </div>
    </div>
  </div>
  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>
