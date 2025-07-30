<template>
  <div class="p-4 min-h-[600px]">
    <!-- 매물 등록 버튼 -->
    <div class="flex justify-center mb-6">
      <button class="flex items-center gap-1 px-20 py-3 bg-[#2e3548] text-white rounded-md">
        <span class="text-2xl font-bold relative -top-[2px] -left-[30px]">+</span>
        <BaseTypography class="text-base !text-white">매물 등록하기</BaseTypography>
      </button>
    </div>

    <!-- 거래 그룹 -->
    <div v-if="trades.length > 0" class="space-y-6">
      <div v-for="(group, index) in tradeGroups" :key="index">
        <!-- 그룹 타이틀 -->
        <BaseTypography class="text-lg !font-bold mb-2">
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
              <BaseTypography class="font-semibold text-sm !font-bold">
                {{ item.name }}
              </BaseTypography>
              <!-- 프로그레스 바 + 퍼센트 표시 -->
              <div class="flex items-center mt-1">
                <!-- 바 -->
                <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-indigo-500 transition-all duration-300"
                    :style="{ width: item.percent + '%' }"
                  ></div>
                </div>

                <!-- 퍼센트 텍스트 -->
                <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                  {{ item.percent }}%
                </BaseTypography>
              </div>
              <!-- 남은 주(금액) 정보 -->
              <BaseTypography class="text-xs !text-gray-500">
                남은 주(금액): {{ item.left.toLocaleString() }} /
                {{ item.total.toLocaleString() }} ({{ item.percent }}%)
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
