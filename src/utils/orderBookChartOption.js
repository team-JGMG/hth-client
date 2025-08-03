import { labelStyles } from '@/components/constants/chartStyles'

export const generateOrderBookChartOption = ({ prices, buyVolumes, sellVolumes, currentPrice }) => {
  const currentPriceIndex = prices.findIndex((p) => p === currentPrice)

  return {
    animationDurationUpdate: 300,
    animationEasingUpdate: 'linear',

    grid: [
      { top: '0%', bottom: '0%', left: '0%', right: '60%', containLabel: false },
      { top: '0%', bottom: '0%', left: '60%', right: '0%', containLabel: false },
      { top: '0%', bottom: '0%', left: '50%', right: '40%', width: '10%', containLabel: false },
    ],

    xAxis: Array(3)
      .fill(0)
      .map((_, i) => ({
        type: 'value',
        position: 'top',
        inverse: i === 0,
        gridIndex: i,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      })),

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
          rich: labelStyles,
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
        animationDuration: 300,
        animationEasing: 'linear',
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
        animationDuration: 300,
        animationEasing: 'linear',
      },
    ],
  }
}
