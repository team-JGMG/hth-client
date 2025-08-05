<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="flex justify-center items-center h-[530px]">
      <div class="text-gray-500">차트 데이터를 불러오는 중...</div>
    </div>
    <div v-else-if="error" class="flex justify-center items-center h-[530px]">
      <div class="text-red-500">{{ error }}</div>
    </div>
    <div v-else class="w-[calc(90%+80px)] ml-[-30px] h-[530px]">
      <VChart :option="option" autoresize class="mb-20" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import VChart from 'vue-echarts'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  MarkPointComponent,
  AxisPointerComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getFundingChartData } from '@/api/funding'

// Props 정의
const props = defineProps({
  fundingId: {
    type: [String, Number],
    required: true,
  },
})

echarts.use([
  LineChart,
  BarChart,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  MarkPointComponent,
  AxisPointerComponent,
  CanvasRenderer,
])

const option = ref({})
const loading = ref(false)
const error = ref(null)

// API에서 차트 데이터 가져오기
const fetchChartData = async () => {
  loading.value = true
  error.value = null

  try {
    const { times, prices, volumes, priceChanges, max, min } = await getFundingChartData(
      props.fundingId,
    )

    option.value = {
      backgroundColor: 'transparent',
      grid: [
        { left: 40, right: 20, top: 30, height: '65%' },
        { left: 40, right: 20, bottom: 20, height: '15%' },
      ],
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove',
        showDelay: 0,
        hideDelay: 100,
        enterable: false,
        confine: true,
        extraCssText: 'z-index:0;',
        axisPointer: {
          type: 'line',
          axis: 'x',
          snap: true,
          lineStyle: {
            color: '#999',
            width: 1,
            type: 'solid',
          },
          crossStyle: {
            color: '#999',
            width: 1,
            type: 'solid',
          },
        },
        formatter(params) {
          const p = params[0].data
          const v = volumes[params[0].dataIndex]
          const r = priceChanges[params[0].dataIndex]
          const sign = r > 0 ? '+' : ''
          const color = r > 0 ? '#d60000' : '#0057FF'
          return `
            <div style="font-weight:bold">${params[0].axisValue}</div>
            <div style="color:${color}">${p.toLocaleString()}원 (${sign}${r}%)</div>
            <div>거래량 ${v.toLocaleString()}</div>
          `
        },
      },
      xAxis: [
        {
          type: 'category',
          data: times,
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { fontSize: 12 },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: times,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          type: 'value',
          gridIndex: 1,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
      ],
      series: [
        {
          type: 'line',
          data: prices,
          smooth: true,
          showSymbol: true,
          symbolSize: 0,
          hoverAnimation: true,
          lineStyle: {
            color: '#0057FF',
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 87, 255, 0.25)' },
                { offset: 1, color: 'rgba(0, 87, 255, 0)' },
              ],
            },
          },
          markPoint: {
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#fff',
              borderColor: '#0057FF',
              borderWidth: 2,
            },
            data: [
              {
                type: 'max',
                label: {
                  formatter: () => `최고 ${max.toLocaleString()}`,
                  position: 'top',
                  offset: [0, -15],
                  fontWeight: 'bold',
                  color: '#0057FF',
                },
              },
              {
                type: 'min',
                label: {
                  formatter: () => `최저 ${min.toLocaleString()}`,
                  position: 'bottom',
                  offset: [15, 15],
                  fontWeight: 'bold',
                  color: '#0057FF',
                },
              },
            ],
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: '#e0e0e0',
              width: 1,
              type: 'solid',
            },
            data: times.map((time, index) => ({
              xAxis: index,
              label: { show: false },
            })),
          },
        },
        {
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: '#d3d3d3',
          },
          barWidth: '40%',
        },
      ],
    }
  } catch (err) {
    console.error('차트 데이터 로딩 실패:', err)
    error.value = err.message || '차트 데이터를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChartData()
})

// 외부에서 데이터 새로고침을 위해 노출
defineExpose({
  fetchChartData,
})
</script>

<style scoped>
.echarts {
  font-family: 'Pretendard', sans-serif;
}
</style>
