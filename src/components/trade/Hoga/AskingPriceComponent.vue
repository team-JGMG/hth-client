<template>
  <div class="h-[800px] overflow-y-auto no-scrollbar w-full flex flex-col items-center gap-3 pb-4">
    <!-- 상단: 상한가 -->
    <div class="text-center mt-4">
      <div class="text-sm text-black font-bold">상한가</div>
      <div class="text-base text-red-500 font-semibold">
        {{ upperLimitPrice.toLocaleString() }} 원
      </div>
    </div>

    <!-- 차트 본체 -->
    <VChart :option="option" :key="chartKey" autoresize class="w-full min-h-[600px]" />

    <!-- 하단: 하한가 -->
    <div class="text-center">
      <div class="text-base text-blue-700 font-semibold">
        {{ lowerLimitPrice.toLocaleString() }} 원
      </div>
      <div class="text-sm text-black font-bold">하한가</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch, computed } from 'vue'

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

const props = defineProps({
  refreshTrigger: { type: Number, default: 0 },
})

const option = ref({})
const chartKey = ref(0)
const fundingId = 1

const tradeStore = useTradeStore()

const updateChart = (parsed) => {
  console.log('📊 차트 갱신 시작', parsed)
  const currentPriceIndex = parsed.prices.findIndex((p) => p === parsed.currentPrice)
  emit('centerIndex', currentPriceIndex, parsed.prices)

  option.value = generateOrderBookChartOption(parsed)
  chartKey.value++ // 🔁 차트 재렌더링 유도
  console.log('✅ 차트 옵션 적용 완료:', option.value)
}

const { reconnect } = useOrderBookSocket(fundingId, (parsedData) => {
  console.log('📡 WebSocket 수신:', parsedData)
  tradeStore.setTradeData(parsedData)
  updateChart(parsedData)
})

watch(
  () => props.refreshTrigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal && newVal !== 0) {
      console.log(
        'AskingPriceComponent - refreshTrigger changed from',
        oldVal,
        'to',
        newVal,
        ', reconnecting socket...',
      )
      reconnect()
    }
  },
)

// ⬇️ 상/하한가 표시용 계산
const upperLimitPrice = computed(() => tradeStore.upperLimitPrice || 0)
const lowerLimitPrice = computed(() => tradeStore.lowerLimitPrice || 0)
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
