<template>
  <VChart :option="option" autoresize class="w-full min-h-[800px]" />
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTradeStore } from '@/stores/tradeStore'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket'
import { generateOrderBookChartOption } from '@/utils/orderBookChartOption'

use([BarChart, GridComponent, CanvasRenderer])

const emit = defineEmits(['centerIndex'])
const option = ref({})
const fundingId = 1 // 필요 시 props로 바꿀 수 있음

const tradeStore = useTradeStore()

const updateChart = (parsed) => {
  console.log('📊 차트 갱신 시작', parsed)
  const currentPriceIndex = parsed.prices.findIndex((p) => p === parsed.currentPrice)
  emit('centerIndex', currentPriceIndex)
  option.value = generateOrderBookChartOption(parsed)
  console.log('✅ 차트 옵션 적용 완료:', option.value)
}

useOrderBookSocket(fundingId, (parsedData) => {
  console.log('📡 WebSocket 수신:', parsedData)
  tradeStore.setTradeData(parsedData)
  updateChart(parsedData)
})
</script>
