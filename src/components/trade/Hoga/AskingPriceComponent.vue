<template>
  <div class="h-[800px] overflow-y-auto no-scrollbar w-full flex flex-col items-center gap-3 pb-4">
    <!-- 상단: 상한가 -->
    <div class="text-center mt-4">
      <div class="text-sm text-black font-bold">상한가</div>
      <div class="text-base text-red-500 font-semibold">
        {{ (parsedData?.upperLimitPrice ?? 0).toLocaleString() }} 원
      </div>
    </div>

    <!-- 차트 -->
    <div ref="chartRef" class="w-full min-h-[600px]" />

    <!-- 하단: 하한가 -->
    <div class="text-center">
      <div class="text-base text-blue-700 font-semibold">
        {{ (parsedData?.lowerLimitPrice ?? 0).toLocaleString() }} 원
      </div>
      <div class="text-sm text-black font-bold">하한가</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch, onMounted, onBeforeUnmount, toRefs } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { generateOrderBookChartOption } from '@/utils/orderBookChartOption'

echarts.use([BarChart, GridComponent, CanvasRenderer])

const emit = defineEmits(['centerIndex'])

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
  fundingId: { type: Number, required: true },
  parsedData: { type: Object, default: null },
})
const { parsedData } = toRefs(props)

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  if (parsedData.value) updateChart(parsedData.value)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})

function handleResize() {
  chartInstance?.resize()
}

function updateChart(parsed) {
  const idx = parsed.prices.findIndex((p) => p === parsed.currentPrice)
  emit('centerIndex', idx, parsed.prices)
  const option = generateOrderBookChartOption(parsed)
  chartInstance?.setOption(option, false) // replaceMerge 원하면 옵션 조절
}

// parsedData 변경 시에만 차트 갱신
watch(
  parsedData,
  (val) => {
    if (val) updateChart(val)
  },
  { immediate: true },
)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
