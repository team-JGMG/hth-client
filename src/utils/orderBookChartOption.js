import { labelStyles } from '@/components/constants/chartStyles'

export const generateOrderBookChartOption = ({ prices, buyVolumes, sellVolumes, currentPrice }) => {
  const DISPLAY_RANGE = 10
  const totalDisplayItems = DISPLAY_RANGE * 2 + 1
  const centerPosition = DISPLAY_RANGE

  const priceData = prices
    .map((price, i) => ({
      price,
      buy: buyVolumes[i],
      sell: sellVolumes[i],
    }))
    .sort((a, b) => b.price - a.price)

  const sortedPrices = priceData.map((item) => item.price)
  const sortedBuyVolumes = priceData.map((item) => item.buy)
  const sortedSellVolumes = priceData.map((item) => item.sell)

  const currentPriceIndex = sortedPrices.findIndex((p) => p === currentPrice)

  const displayPrices = new Array(totalDisplayItems).fill('')
  const displayBuyVolumes = new Array(totalDisplayItems).fill(0)
  const displaySellVolumes = new Array(totalDisplayItems).fill(0)

  displayPrices[centerPosition] = currentPrice
  if (currentPriceIndex !== -1) {
    displayBuyVolumes[centerPosition] = sortedBuyVolumes[currentPriceIndex] || 0
    displaySellVolumes[centerPosition] = sortedSellVolumes[currentPriceIndex] || 0
  }

  for (let i = 1; i <= DISPLAY_RANGE; i++) {
    const sourceIndex = currentPriceIndex - i
    const displayIndex = centerPosition - i
    if (sourceIndex >= 0) {
      displayPrices[displayIndex] = sortedPrices[sourceIndex]
      displayBuyVolumes[displayIndex] = sortedBuyVolumes[sourceIndex] || 0
      displaySellVolumes[displayIndex] = sortedSellVolumes[sourceIndex] || 0
    }
  }

  for (let i = 1; i <= DISPLAY_RANGE; i++) {
    const sourceIndex = currentPriceIndex + i
    const displayIndex = centerPosition + i
    if (sourceIndex < sortedPrices.length) {
      displayPrices[displayIndex] = sortedPrices[sourceIndex]
      displayBuyVolumes[displayIndex] = sortedBuyVolumes[sourceIndex] || 0
      displaySellVolumes[displayIndex] = sortedSellVolumes[sourceIndex] || 0
    }
  }

  const currentDisplayIndex = centerPosition

  return {
    animationDurationUpdate: 300,
    animationEasingUpdate: 'linear',

    grid: [
      {
        top: '5%',
        bottom: '5%',
        left: '5%',
        right: '60%',
        containLabel: false,
        height: '90%',
      },
      {
        top: '5%',
        bottom: '5%',
        left: '60%',
        right: '5%',
        containLabel: false,
        height: '90%',
      },
      {
        top: '5%',
        bottom: '5%',
        left: '45%',
        right: '45%',
        width: '10%',
        containLabel: false,
        height: '90%',
      },
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
        data: displayPrices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        boundaryGap: true,
        splitNumber: totalDisplayItems - 1,
      },
      {
        type: 'category',
        gridIndex: 1,
        inverse: false,
        data: displayPrices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        boundaryGap: true,
        splitNumber: totalDisplayItems - 1,
      },
      {
        type: 'category',
        gridIndex: 2,
        inverse: false,
        data: displayPrices,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          align: 'center',
          fontSize: 12,
          interval: 0,
          formatter: (value, index) => {
            if (!value) return ''
            if (index === currentDisplayIndex) return `{highlight|${value}}`
            // 🎨 색상 로직 수정: 매도(sell) 가격을 빨간색, 매수(buy) 가격을 파란색으로 변경
            else if (displaySellVolumes[index] > 0) return `{red|${value}}`
            else if (displayBuyVolumes[index] > 0) return `{blue|${value}}`
            else return value
          },
          rich: labelStyles,
        },
        splitLine: { show: false },
        boundaryGap: true,
        splitNumber: totalDisplayItems - 1,
      },
    ],

    series: [
      {
        name: '매도',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: displaySellVolumes,
        barWidth: '80%',
        barMaxWidth: 40,
        // 매도 주문량 막대 그래프는 파란색 계열
        itemStyle: { color: '#cce5ff', borderRadius: [4, 4, 4, 4] },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => (params.value === 0 ? '' : params.value),
          fontWeight: 'bold',
          fontSize: 11,
        },
        animationDuration: 300,
        animationEasing: 'linear',
      },
      {
        name: '매수',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: displayBuyVolumes,
        barWidth: '80%',
        barMaxWidth: 40,
        // 매수 주문량 막대 그래프는 빨간색 계열
        itemStyle: { color: '#fbd5d5', borderRadius: [4, 4, 4, 4] },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => (params.value === 0 ? '' : params.value),
          fontWeight: 'bold',
          fontSize: 11,
        },
        animationDuration: 300,
        animationEasing: 'linear',
      },
    ],
  }
}
