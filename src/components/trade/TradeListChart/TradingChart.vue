<template>
  <VChart :option="option" autoresize class="mb-20 mt-10" />
</template>

<script setup>
import { ref, watch } from 'vue'
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
import { getFundingTradeHistory } from '@/api/funding'
import { subMonths, subYears, isAfter, parseISO } from 'date-fns'

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

const props = defineProps({
  fundingId: {
    type: Number,
    required: true,
  },
  timeRange: {
    type: String,
    required: true,
  },
})

const option = ref({})

const formatDate = (dateStr) => {
  return dateStr
}

const fetchChartData = async () => {
  try {
    const allHistory = await getFundingTradeHistory(props.fundingId)

    let filteredHistory = allHistory
    const now = new Date()

    if (props.timeRange === '1y') {
      const oneYearAgo = subYears(now, 1)
      filteredHistory = allHistory.filter((d) => isAfter(parseISO(d.date), oneYearAgo))
    } else if (props.timeRange === '3m') {
      const threeMonthsAgo = subMonths(now, 3)
      filteredHistory = allHistory.filter((d) => isAfter(parseISO(d.date), threeMonthsAgo))
    } else if (props.timeRange === '1m') {
      const oneMonthAgo = subMonths(now, 1)
      filteredHistory = allHistory.filter((d) => isAfter(parseISO(d.date), oneMonthAgo))
    }

    const times = filteredHistory.map((d) => formatDate(d.date))
    const prices = filteredHistory.map((d) => d.closingPrice)
    const volumes = filteredHistory.map((d) => d.volume)
    const changeRates = filteredHistory.map((d) => d.priceChangeRate)

    const max = prices.length > 0 ? Math.max(...prices) : 0
    const min = prices.length > 0 ? Math.min(...prices) : 0

    option.value = {
      backgroundColor: 'transparent',
      grid: [
        { left: 40, right: 40, top: 40, height: '70%' }, // 가격 차트 높이 조금 키움
        { left: 50, right: 40, top: '78%', height: '15%' }, // 거래량 차트 바로 아래 배치
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
          const p = prices[params[0].dataIndex]
          const v = volumes[params[0].dataIndex]
          const r = changeRates[params[0].dataIndex]
          const sign = r > 0 ? '+' : ''
          const color = r > 0 ? '#d60000' : '#0057FF'
          return `
            <div style="font-weight:bold">${times[params[0].dataIndex]}</div>
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
          axisLabel: { show: false },
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
          min: 0,
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
          smooth: false,
          showSymbol: true,
          symbolSize: 0,
          hoverAnimation: true,
          lineStyle: {
            color: '#0057FF',
            width: 2,
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
  } catch {
    //
  }
}

defineExpose({
  fetchChartData,
})

watch(
  () => props.timeRange,
  () => {
    fetchChartData()
  },
  { immediate: true },
)
</script>
