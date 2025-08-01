<template>
  <div class="overflow-hidden">
    <div class="w-[calc(90%+80px)] ml-[-30px] h-[530px]">
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
import { mockOrderbookData as chartData } from '@/utils/tradeHistoryData'

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

const fetchChartData = () => {
  const times = chartData.map((d) => d.time)
  const prices = chartData.map((d) => d.price)
  const volumes = chartData.map((d) => d.volume)

  const max = Math.max(...prices)
  const min = Math.min(...prices)

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
        const v = chartData[params[0].dataIndex].volume
        const r = chartData[params[0].dataIndex].change_rate
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
        showSymbol: true, // hover 감지를 위해 활성화
        symbolSize: 0, // 보이지 않게 설정
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
              { offset: 0, color: 'rgba(0, 87, 255, 0.25)' }, // 위쪽 진한 파랑
              { offset: 1, color: 'rgba(0, 87, 255, 0)' }, // 아래쪽 투명
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
