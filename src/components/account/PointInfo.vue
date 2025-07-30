<!-- PointInfo.vue -->
<script setup>
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatDateTime } from '@/utils/format.js'

function formatToMMDD(dateStr) {
  const fullDate = formatDateTime(dateStr) // 예: '2025.7.14 11:11'
  const [datePart] = fullDate.split(' ')
  const [, mm, dd] = datePart.split('.')
  return `${mm.padStart(2, '0')}.${dd.padStart(2, '0')}`
}

function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(dateStr).split(' ')
  return timePart
}

const pointLogs = [
  {
    date: '2025.07.14 11:11:00',
    title: '포인트 충전',
    desc: '세부내용 있으면 여기에 없으면말고',
    amount: 11250,
  },
  {
    date: '2025.07.14 11:11:00',
    title: '포인트 환급',
    desc: '부내용 있으면 여기에 없으면말고',
    amount: -11250,
  },
  { date: '2025.07.14 11:11:00', title: '펀딩 실패', desc: '', amount: -11250 },
  { date: '2025-07-14 11:11:00', title: '포인트 충전', desc: '', amount: 11250 },
  { date: '2025-07-14 11:11:00', title: '포인트 환급', desc: '', amount: -11250 },
  { date: '2024-07-14 11:11:00', title: '포인트 환급', desc: '', amount: -11250 },
]

const groupedLogs = computed(() => {
  const yearMap = new Map()

  pointLogs.forEach((log) => {
    const year = log.date.slice(0, 4)
    if (!yearMap.has(year)) yearMap.set(year, [])
    yearMap.get(year).push(log)
  })

  return [...yearMap.entries()].sort((a, b) => b[0] - a[0]).map(([year, logs]) => ({ year, logs }))
})
</script>
<template>
  <div class="p-4 min-h-[600px] space-y-6">
    <div v-for="group in groupedLogs" :key="group.year">
      <BaseTypography class="text-sm text-gray-500"> {{ group.year }}년 </BaseTypography>

      <!-- 항목 전체 -->
      <div
        v-for="(log, idx) in group.logs"
        :key="idx"
        :class="[
          'flex items-center gap-4 rounded-md px-3 h-[72px] overflow-hidden',
          idx % 2 === 0 ? 'bg-gray-100' : 'bg-white',
        ]"
      >
        <!-- 날짜 -->
        <!-- 날짜 -->
        <div class="flex flex-col justify-center items-end min-w-[50px] h-full">
          <BaseTypography class="text-gray-500 text-xs text-right">
            {{ formatToMMDD(log.date) }}
          </BaseTypography>
          <BaseTypography class="text-xs text-gray-500 text-right">
            {{ formatToHHMM(log.date) }}
          </BaseTypography>
        </div>

        <!-- 제목 + 세부내용 -->
        <div class="flex-1 flex flex-col justify-center h-full overflow-hidden">
          <!-- 제목 -->
          <div class="h-[20px] overflow-hidden">
            <BaseTypography class="!font-bold text-sm truncate whitespace-nowrap overflow-hidden">
              {{ log.title }}
            </BaseTypography>
          </div>

          <!-- 세부내용 -->
          <div class="h-[18px] overflow-hidden">
            <BaseTypography
              class="text-xs !font-semibold text-gray-600 truncate whitespace-nowrap overflow-hidden"
              :title="log.desc || ''"
            >
              {{ log.desc || '\u00A0' }}
            </BaseTypography>
          </div>
        </div>
        <!-- 금액 -->
        <BaseTypography class="text-sm !font-black min-w-[60px] text-right px-2">
          <span :class="log.amount > 0 ? 'text-red-600' : 'text-blue-600'">
            {{ log.amount > 0 ? '+' : '-' }}{{ Math.abs(log.amount).toLocaleString() }}
          </span>
        </BaseTypography>
      </div>
    </div>
  </div>
</template>
