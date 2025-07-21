<template>
  <div class="p-4">
    <!-- 매물 등록 버튼 -->
    <button class="w-full py-3 bg-[#2e3548] text-white rounded-md text-center mb-6">
      <BaseTypography class="text-base font-semibold text-white">+ 매물 등록하기</BaseTypography>
    </button>

    <!-- 거래 그룹 -->
    <div v-if="trades.length > 0" class="space-y-6">
      <div v-for="(group, index) in tradeGroups" :key="index">
        <!-- 그룹 타이틀 -->
        <BaseTypography class="font-bold text-base mb-2">
          {{ group.title }}
        </BaseTypography>

        <div class="space-y-3">
          <!-- 개별 매물 -->
          <div
            v-for="(item, idx) in group.items"
            :key="idx"
            class="flex bg-white rounded-lg border px-3 py-2 items-center"
          >
            <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
            <div class="flex-1">
              <!-- 매물명 -->
              <BaseTypography class="font-semibold text-sm">
                {{ item.name }}
              </BaseTypography>

              <!-- 구좌 정보 -->
              <BaseTypography class="text-xs text-gray-500">
                남은 구좌수: {{ item.left.toLocaleString() }} /
                {{ item.total.toLocaleString() }} ({{ item.percent }}%)
              </BaseTypography>

              <!-- 100% 완료 표시 -->
              <BaseTypography v-if="item.percent === 100" class="text-xs text-blue-500 font-bold">
                100%
              </BaseTypography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const trades = [
  {
    name: '63빌딩 초고층 6301호',
    percent: 63,
    left: 1_550,
    total: 7_750_000,
    img: '/assets/sample-building.jpg',
    status: '진행 중',
  },
  {
    name: '63빌딩 초고층 6301호',
    percent: 100,
    left: 0,
    total: 1_234_567,
    img: '/assets/sample-building.jpg',
    status: '거래 완료',
  },
  {
    name: '63빌딩 초고층 6301호',
    percent: 0,
    left: 0,
    total: 0,
    img: '/assets/sample-building.jpg',
    status: '승인 대기',
  },
]

const tradeGroups = [
  {
    title: '거래 진행중인 매물',
    items: trades.filter((t) => t.status === '진행 중'),
  },
  {
    title: '거래 완료된 매물',
    items: trades.filter((t) => t.status === '거래 완료'),
  },
  {
    title: '승인 대기 중인 매물',
    items: trades.filter((t) => t.status === '승인 대기'),
  },
]
</script>
