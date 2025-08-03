<template>
  <VChart :option="option" :key="chartKey" autoresize class="w-full min-h-[800px]" />
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
})
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
const chartKey = ref(0) // ✅ 차트 강제 리렌더링을 위한 key
const fundingId = 1 // 필요 시 props로 바꿀 수 있음

console.log('💡 현재 fundingId:', fundingId)

const tradeStore = useTradeStore()

const updateChart = (parsed) => {
  console.log('📊 차트 갱신 시작', parsed)
  const currentPriceIndex = parsed.prices.findIndex((p) => p === parsed.currentPrice)
  emit('centerIndex', currentPriceIndex, parsed.prices)

  option.value = generateOrderBookChartOption(parsed)
  chartKey.value++ // ✅ 차트 재렌더링 유도
  console.log('✅ 차트 옵션 적용 완료:', option.value)
}

const { reconnect } = useOrderBookSocket(fundingId, (parsedData) => {
  console.log('📡 WebSocket 수신:', parsedData)
  tradeStore.setTradeData(parsedData)
  updateChart(parsedData)
})

watch(() => props.refreshTrigger, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== 0) {
    console.log('AskingPriceComponent - refreshTrigger changed from', oldVal, 'to', newVal, ', reconnecting socket...')
    reconnect()
  }
})
</script>
