<template>
  <BaseTab v-model="timeRange" :tabs="timeRangeTabs" @update:model-value="handleTimeRangeChange" />

  <div class="w-[calc(90%+80px)] ml-[-20px] h-[400px]">
    <TradingChart ref="chartRef" :fundingId="fundingId" :timeRange="timeRange" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TradingChart from './TradingChart.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'

defineProps({
  fundingId: {
    type: Number,
    required: true,
  },
})

const timeRangeTabs = [
  { label: '1년', value: '1y' },
  { label: '3개월', value: '3m' },
  { label: '1개월', value: '1m' },
]

const timeRange = ref('1y')
const chartRef = ref(null)

const handleTimeRangeChange = (newRange) => {
  timeRange.value = newRange
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
