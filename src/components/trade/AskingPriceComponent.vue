<template>
  <VChart :option="option" autoresize class="w-full h-[500px]" />
</template>

<script setup>
import { ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, CanvasRenderer])

const prices = ['2,175', '2,170', '2,165', '2,160', '2,150', '2,175', '1,975'] // 중앙 y축
const buyVolumes = [96, 40, 8, 10, 1, 100, 0] // 왼쪽 바 (매수)
const sellVolumes = [0, 0, 0, 0, 0, 0, 50] // 오른쪽 바 (매도)

const option = ref({
  grid: [
    { left: '0%', right: '60%', containLabel: false },
    { left: '60%', right: '0%', containLabel: false },
    { left: '50%', right: '40%', width: '10%', containLabel: false }, // 가격 표시용 중앙 그리드
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
        fontWeight: 'bold',
        margin: 0,
        formatter: (value, index) => {
          // 매수 바가 있는 경우 빨간색
          if (buyVolumes[index] > 0) {
            return `{red|${value}}`
          }
          // 매도 바가 있는 경우 파란색
          else if (sellVolumes[index] > 0) {
            return `{blue|${value}}`
          }

          // 기본색
          return value
        },
        rich: {
          red: { color: 'red', fontWeight: 'bold' },
          blue: { color: 'blue', fontWeight: 'bold' },
          black: { color: '#000', fontWeight: 'bold', fontSize: 16 },
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
        borderRadius: [10, 10, 10, 10], // 왼쪽 둥글게
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}',
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
        borderRadius: [10, 10, 10, 10], // 오른쪽 둥글게
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}',
        fontWeight: 'bold',
      },
    },
  ],
})
</script>
