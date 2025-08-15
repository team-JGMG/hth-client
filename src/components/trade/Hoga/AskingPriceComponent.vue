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
    console.warn('⚠️ 차트 인스턴스 또는 데이터 없음')
    return
  }

  try {
    console.log('📊 차트 업데이트 시작:', {
      timestamp: parsed.timestamp,
      pricesCount: parsed.prices?.length,
      currentPrice: parsed.currentPrice,
    })

    const idx = parsed.prices.findIndex((p) => p === parsed.currentPrice)
    emit('centerIndex', idx, parsed.prices)

    const option = generateOrderBookChartOption(parsed)

    // ECharts 강제 갱신
    chartInstance.clear() // 기존 차트 클리어
    chartInstance.setOption(option, true) // notMerge: true로 완전 재설정
    chartInstance.resize() // 리사이즈로 강제 리렌더링

    console.log('✅ 차트 업데이트 완료:', new Date().toLocaleTimeString())
  } catch (error) {
    console.error('❌ 차트 업데이트 실패:', error)

    // 에러 발생시 차트 재초기화 시도
    try {
      chartInstance.dispose()
      chartInstance = echarts.init(chartRef.value)
      chartInstance.setOption(generateOrderBookChartOption(parsed))
      console.log('🔧 차트 재초기화 완료')
    } catch (retryError) {
      console.error('❌ 차트 재초기화도 실패:', retryError)
    }
  }
}

// parsedData 변경 시 즉시 차트 갱신
watch(
  parsedData,
  (newVal, oldVal) => {
    console.log('🔄 AskingPriceComponent - parsedData 변경 감지:', {
      hasNewData: !!newVal,
      oldTimestamp: oldVal?.timestamp,
      newTimestamp: newVal?.timestamp,
      pricesLength: newVal?.prices?.length,
    })

    if (newVal && chartInstance) {
      // 즉시 업데이트
      updateChart(newVal)
    }
  },
  {
    immediate: true,
    deep: true,
    flush: 'sync', // 동기적으로 즉시 실행
  },
)

// refreshTrigger 변경 시에도 강제 갱신
watch(
  () => props.refreshTrigger,
  (newVal, oldVal) => {
    console.log('🔄 AskingPriceComponent - refreshTrigger 변경:', oldVal, '->', newVal)
    if (parsedData.value && chartInstance) {
      updateChart(parsedData.value)
    }
  },
)

// fundingId 변경 시에도 차트 재초기화
watch(
  () => props.fundingId,
  (newId, oldId) => {
    if (newId !== oldId) {
      console.log('🔄 AskingPriceComponent - fundingId 변경:', oldId, '->', newId)
      // 차트 완전 재초기화
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
