<template>
  <div class="overflow-hidden">
    <div class="flex justify-end p-2">
      <button
        @click="setTimeRange('1y')"
        :class="{ 'bg-blue-500 text-white': timeRange === '1y' }"
        class="px-4 py-2 rounded-l-md border border-gray-300"
      >
        1년
      </button>
      <button
        @click="setTimeRange('3m')"
        :class="{ 'bg-blue-500 text-white': timeRange === '3m' }"
        class="px-4 py-2 border-t border-b border-gray-300"
      >
        3개월
      </button>
      <button
        @click="setTimeRange('1m')"
        :class="{ 'bg-blue-500 text-white': timeRange === '1m' }"
        class="px-4 py-2 rounded-r-md border border-gray-300"
      >
        1개월
      </button>
    </div>
    <div class="w-[calc(90%+80px)] ml-[-20px] h-[400px]">
      <TradingChart ref="chartRef" :fundingId="fundingId" :timeRange="timeRange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TradingChart from './TradingChart.vue'

defineProps({
  fundingId: {
    type: Number,
    required: true,
  },
})

const timeRange = ref('1y') // ✅ 기본값을 '1y'로 변경
const chartRef = ref(null)

const setTimeRange = (range) => {
  timeRange.value = range
  if (chartRef.value) {
    chartRef.value.fetchChartData()
  }
}

onMounted(() => {
  if (chartRef.value) {
    chartRef.value.fetchChartData()
  }
})
</script>
