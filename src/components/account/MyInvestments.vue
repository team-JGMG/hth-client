<template>
  <div class="p-4 space-y-6">
    <div v-for="(group, idx) in investmentGroups" :key="idx">
      <!-- 그룹 타이틀 -->
      <BaseTypography class="font-bold text-base mb-2">
        {{ group.title }}
      </BaseTypography>

      <div class="space-y-3">
        <div
          v-for="(item, index) in group.items"
          :key="index"
          class="flex bg-white border rounded-lg px-3 py-2 items-center"
        >
          <!-- 이미지 -->
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />

          <!-- 텍스트 정보 -->
          <div class="flex-1">
            <!-- 매물명 -->
            <BaseTypography class="font-semibold text-sm">
              {{ item.name }}
            </BaseTypography>

            <!-- 보유 매물인 경우 -->
            <template v-if="item.type === '보유'">
              <BaseTypography class="text-xs text-gray-500">
                보유 주 수량: {{ item.shares }}
              </BaseTypography>
              <BaseTypography class="text-sm text-pink-600 font-bold">
                현재 시세 {{ item.price.toLocaleString() }}원
              </BaseTypography>
            </template>

            <!-- 거래 대기 매물인 경우 -->
            <template v-else-if="item.type === '대기'">
              <BaseTypography class="text-sm text-pink-500 font-bold">
                호가 {{ item.askPrice.toLocaleString() }}원
              </BaseTypography>
              <BaseTypography class="text-xs text-gray-500">
                판매 대기 수량: {{ item.pendingShares }}주
              </BaseTypography>
            </template>
          </div>

          <!-- 취소 버튼 -->
          <button
            v-if="item.type === '대기'"
            class="text-sm bg-[#fff0f0] text-red-500 border border-red-300 rounded px-3 py-1 ml-2"
          >
            <BaseTypography class="text-sm font-semibold text-red-500"> 취소하기 </BaseTypography>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const investments = [
  {
    name: '63빌딩 초고층 6308호',
    type: '보유',
    shares: 6,
    price: 5550,
    img: '/assets/sample-building.jpg',
  },
  {
    name: '63빌딩 초고층 6308호',
    type: '대기',
    pendingShares: 5,
    askPrice: 4800,
    img: '/assets/sample-building.jpg',
  },
]

const investmentGroups = [
  {
    title: '보유중인 매물',
    items: investments.filter((i) => i.type === '보유'),
  },
  {
    title: '거래 대기 중인 매물',
    items: investments.filter((i) => i.type === '대기'),
  },
]
</script>
