<template>
  <VChart :option="option" autoresize class="w-full min-h-[800px]" />
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useTradeStore } from '@/stores/tradeStore'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useOrderBookSocket } from '@/hooks/useOrderBookSocket'

use([BarChart, GridComponent, CanvasRenderer])

const emit = defineEmits(['centerIndex'])
const option = ref({})
const fundingId = 1 // 실제 fundingId로 바꿔주세요

const tradeStore = useTradeStore()

useOrderBookSocket(fundingId, (parsedData) => {
  console.log('Received data from WebSocket:', parsedData)
  tradeStore.setTradeData(parsedData)
  updateChart(parsedData)
})

const updateChart = (parsed) => {
  const { prices, buyVolumes, sellVolumes, currentPrice } = parsed
  const currentPriceIndex = prices.findIndex((p) => p === currentPrice)

  emit('centerIndex', currentPriceIndex)

  option.value = {
    grid: [
      { left: '0%', right: '60%', containLabel: false }, // 매도
      { left: '60%', right: '0%', containLabel: false }, // 매수
      { left: '50%', right: '40%', width: '10%', containLabel: false }, // 가격
    ],
    xAxis: [
      {
        type: 'value',
        inverse: true,
        position: 'top',
        gridIndex: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'value',
        position: 'top',
        gridIndex: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'value',
        gridIndex: 2,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'category',
        gridIndex: 0,
        inverse: false,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        gridIndex: 1,
        inverse: false,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        gridIndex: 2,
        inverse: false,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          align: 'center',
          formatter: (value, index) => {
            if (index === currentPriceIndex) return `{highlight|${value}}`
            else if (buyVolumes[index] > 0) return `{blue|${value}}`
            else if (sellVolumes[index] > 0) return `{red|${value}}`
            else return value
          },
          rich: {
            red: { color: 'red', fontWeight: 'bold', fontSize: 14 },
            blue: { color: 'blue', fontWeight: 'bold', fontSize: 14 },
            highlight: {
              color: '#000',
              fontWeight: 'bold',
              fontSize: 14,
            },
          },
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '매도',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: sellVolumes,
        barWidth: 30,
        itemStyle: {
          color: '#cce5ff',
          borderRadius: [4, 4, 4, 4],
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => (params.value === 0 ? '' : params.value),
          fontWeight: 'bold',
        },
      },
      {
        name: '매수',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: buyVolumes,
        barWidth: 30,
        itemStyle: {
          color: '#fbd5d5',
          borderRadius: [4, 4, 4, 4],
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => (params.value === 0 ? '' : params.value),
          fontWeight: 'bold',
        },
      },
    ],
  }
}
</script>
