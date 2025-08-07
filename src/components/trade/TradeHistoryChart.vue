<template>
  <div class="overflow-hidden">
    <div class="w-[calc(90%+80px)] ml-[-20px] h-[400px]">
      <VChart :option="option" autoresize class="mb-20 mt-10" />
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
import { getFundingTradeHistory } from '@/api/funding' // ✅ API 호출

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

// ✅ 상위 컴포넌트로부터 fundingId를 props로 받음
const props = defineProps({
  fundingId: {
    type: Number,
    required: true,
  },
})

const option = ref({})

const fetchChartData = async () => {
  try {
    const history = await getFundingTradeHistory(props.fundingId)
    console.log('[📈history]:', history)

    const times = history.map((d) => d.date)
    const prices = history.map((d) => d.closingPrice)
    const volumes = history.map((d) => d.volume)
    const changeRates = history.map((d) => d.priceChangeRate)

    const max = Math.max(...prices)
    const min = Math.min(...prices)

    option.value = {
      backgroundColor: 'transparent',
      grid: [
        {
          left: 40, // ← 왼쪽 여백 증가
          right: 40, // ← 오른쪽 여백 증가
          top: 40, // ← 위 여백 증가 (최고 레이블 보호)
          height: '65%',
        },
        {
          left: 50,
          right: 40,
          bottom: 10, // ← 아래 여백 증가 (최저 레이블 보호)
          height: '15%',
        },
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
          const r = changeRates[params[0].dataIndex]
          const sign = r > 0 ? '+' : ''
          const color = r > 0 ? '#d60000' : '#0057FF'
          return `
            <div style="font-weight:bold">${params[0].axisValue}</div>
            <div style="color:${color}">${p.toLocaleString()}원 (${sign}${r}%)</div>
            <div>거래량 ${v}</div>
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
                  offset: [0, 15],
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
            data: times.map((_, i) => ({
              xAxis: i,
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
  } catch (e) {
    console.error('[fetchChartData] Error:', e)
  }
}

onMounted(() => {
  fetchChartData()
})

defineExpose({
  fetchChartData,
})
</script>

<style scoped>
.echarts {
  font-family: 'Pretendard', sans-serif;
}
</style>
