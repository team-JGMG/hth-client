<!-- 호가 차트 컴포넌트! -->
<template>
  <VChart :option="option" autoresize class="w-full min-h-[500px]" />
</template>
<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { mockOrderbook, parseOrderbookData, currentPrice } from '@/utils/orderData.js'

use([BarChart, GridComponent, CanvasRenderer])

const option = ref({})
const emit = defineEmits(['centerIndex'])

onMounted(() => {
  const { prices, buyVolumes, sellVolumes } = parseOrderbookData(mockOrderbook)

  const currentPriceIndex = prices.findIndex((p) => p === currentPrice)

  emit('centerIndex', currentPriceIndex)

  option.value = {
    grid: [
      { left: '0%', right: '60%', containLabel: false },
      { left: '60%', right: '0%', containLabel: false },
      { left: '50%', right: '40%', width: '10%', containLabel: false },
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
        inverse: true,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        gridIndex: 1,
        inverse: true,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        gridIndex: 2,
        inverse: true,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          align: 'center',
          margin: 0,
          formatter: (value, index) => {
            if (index === currentPriceIndex) return `{highlight|${value}}`
            else if (buyVolumes[index] > 0) return `{red|${value}}`
            else if (sellVolumes[index] > 0) return `{blue|${value}}`
            else return value
          },
          rich: {
            red: { color: 'red', fontWeight: 'bold', fontSize: 17 },
            blue: { color: 'blue', fontWeight: 'bold', fontSize: 17 },
            highlight: {
              color: '#000',
              fontWeight: 'bold',
              fontSize: 18,
              backgroundColor: 'transparent', // 배경 제거
              borderColor: '#D9D9D9', // 테두리 색상 (검정)
              borderWidth: 1, // 테두리 두께
              padding: [4, 6], // 여백
              borderRadius: 2, // 모서리 둥글게
            },
          },
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '매수',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: buyVolumes,
        barWidth: 30,
        itemStyle: {
          color: '#cce5ff',
          borderRadius: [7, 7, 7, 7],
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => {
            return params.value === 0 ? '' : params.value
          },
          fontWeight: 'bold',
        },
      },
      {
        name: '매도',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: sellVolumes,
        barWidth: 30,
        itemStyle: {
          color: '#fbd5d5',
          borderRadius: [7, 7, 7, 7],
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => {
            return params.value === 0 ? '' : params.value
          },
          fontWeight: 'bold',
        },
      },
    ],
  }
})
</script>
