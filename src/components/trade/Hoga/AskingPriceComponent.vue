<template>
  <div class="h-[800px] overflow-y-auto no-scrollbar w-full flex flex-col items-center gap-3 pb-4">
    <div class="text-center mt-4">
      <div class="text-sm text-black font-bold">상한가</div>
      <div class="text-base text-red-500 font-semibold">
        {{ (parsedData?.upperLimitPrice ?? 0).toLocaleString() }} 원
      </div>
    </div>

    <div ref="chartRef" class="w-full min-h-[600px]" />

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
  if (parsedData.value) {
    updateChart(parsedData.value)
  }
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
  if (!chartInstance || !parsed) {
    return
  }

  try {
    const idx = parsed.prices.findIndex((p) => p === parsed.currentPrice)
    emit('centerIndex', idx, parsed.prices)

    const option = generateOrderBookChartOption(parsed)

    chartInstance.clear()
    chartInstance.setOption(option, true)
    chartInstance.resize()
  } catch {
    try {
      chartInstance.dispose()
      chartInstance = echarts.init(chartRef.value)
      chartInstance.setOption(generateOrderBookChartOption(parsed))
    } catch {
      //
    }
  }
}

watch(
  parsedData,
  (newVal) => {
    if (newVal && chartInstance) {
      updateChart(newVal)
    }
  },
  {
    immediate: true,
    deep: true,
    flush: 'sync',
  },
)

watch(
  () => props.refreshTrigger,
  () => {
    if (parsedData.value && chartInstance) {
      updateChart(parsedData.value)
    }
  },
)

watch(
  () => props.fundingId,
  (newId, oldId) => {
    if (newId !== oldId) {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = echarts.init(chartRef.value)
        if (parsedData.value) {
          updateChart(parsedData.value)
        }
      }
    }
  },
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
