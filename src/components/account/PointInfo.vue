<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const pointLogs = [
  { date: '25.07.14 00:00:00', desc: '어쩌구저쩌구', amount: 10000 },
  { date: '25.07.13 14:32:12', desc: '어쩌구저쩌구', amount: 20000 },
  { date: '25.07.12 09:15:00', desc: '이벤트 지급', amount: 5000 },
  { date: '25.07.11 22:47:05', desc: '어쩌구저쩌구', amount: 10000 },
  { date: '25.07.10 13:21:47', desc: '어쩌구저쩌구', amount: 10000 },
]
</script>
<template>
  <div class="p-4">
    <!-- 포인트 관리 버튼 -->
    <div class="flex justify-between mb-6">
      <button
        class="flex-1 mr-2 py-2 bg-green-100 border-2 border-green-400 text-green-700 rounded-lg"
      >
        <BaseTypography class="text-base font-bold text-center">
          <span class="text-xl mr-1">+</span> 포인트 충전
        </BaseTypography>
      </button>
      <button
        class="flex-1 ml-2 py-2 bg-orange-100 border-2 border-orange-400 text-orange-700 rounded-lg"
      >
        <BaseTypography class="text-base font-bold text-center">
          <span class="text-xl mr-1">-</span> 포인트 환급
        </BaseTypography>
      </button>
    </div>

    <!-- 지급/사용 내역 -->
    <div>
      <BaseTypography class="text-base font-semibold mb-2 block">
        포인트 지급/사용 내역
      </BaseTypography>

      <div class="bg-gray-100 rounded-md overflow-hidden">
        <!-- Header -->
        <div
          class="grid grid-cols-3 py-2 px-3 text-sm font-medium border-b border-gray-300 bg-gray-200"
        >
          <BaseTypography class="text-sm font-medium text-left">날짜</BaseTypography>
          <BaseTypography class="text-sm font-medium text-center">세부 내용</BaseTypography>
          <BaseTypography class="text-sm font-medium text-right">포인트 금액</BaseTypography>
        </div>

        <!-- Rows -->
        <div
          v-for="(log, idx) in pointLogs"
          :key="idx"
          class="grid grid-cols-3 py-3 px-3 text-sm border-b last:border-b-0 bg-white"
        >
          <BaseTypography class="text-sm text-left pl-1">{{ log.date }}</BaseTypography>
          <BaseTypography class="text-sm text-center px-2">{{ log.desc.trim() }}</BaseTypography>
          <BaseTypography class="text-sm font-medium text-right text-black pr-1">
            +{{ log.amount.toLocaleString() }}원
          </BaseTypography>
        </div>
      </div>
    </div>
  </div>
</template>
