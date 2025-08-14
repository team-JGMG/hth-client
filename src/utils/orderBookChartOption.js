import { labelStyles } from '@/components/constants/chartStyles'

export const generateOrderBookChartOption = ({ prices, buyVolumes, sellVolumes, currentPrice }) => {
  const currentPriceIndex = prices.findIndex((p) => p === currentPrice)
  const maxVolume = Math.max(...buyVolumes, ...sellVolumes)

  return {
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',

    grid: [
      { top: '0%', bottom: '0%', left: '0%', right: '60%', containLabel: false },
      { top: '0%', bottom: '0%', left: '60%', right: '0%', containLabel: false },
      { top: '0%', bottom: '0%', left: '52%', right: '50%', width: '10%', containLabel: false },
    ],

    xAxis: Array(3)
      .fill(0)
      .map((_, i) => ({
        type: 'value',
        position: 'top',
        inverse: i === 0,
        gridIndex: i,
        max: i < 2 ? maxVolume : null,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      })),

    yAxis: Array(3)
      .fill(0)
      .map((_, i) => ({
        type: 'category',
        gridIndex: i,
        inverse: true,
        data: prices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel:
          i === 2
            ? {
                show: true,
                align: 'center',
                margin: 12,
                formatter: (value, index) => {
                  if (index === currentPriceIndex) return `{highlight|${value}}`
                  else if (buyVolumes[index] > 0) return `{blue|${value}}`
                  else if (sellVolumes[index] > 0) return `{red|${value}}`
                  else return value
                },
                rich: labelStyles,
              }
            : { show: false },
        splitLine: { show: false },
      })),

    series: [
      {
        name: '매도',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: sellVolumes,
        barWidth: 30,
        barCategoryGap: '60%',
        itemStyle: {
          color: '#fbd5d5',
          borderRadius: [4, 4, 4, 4],
        },
        label: {
          show: true,
          position: 'insideRight',
          align: 'right',
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
        barCategoryGap: '40%',
        itemStyle: {
          color: '#cce5ff',
          borderRadius: [4, 4, 4, 4],
        },
        label: {
          show: true,
          position: 'insideLeft',
          align: 'left',
          formatter: (params) => (params.value === 0 ? '' : params.value),
          fontWeight: 'bold',
        },
      },
    ],
  }
}
