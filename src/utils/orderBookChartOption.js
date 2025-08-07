import { labelStyles } from '@/components/constants/chartStyles'

export const generateOrderBookChartOption = ({ prices, buyVolumes, sellVolumes, currentPrice }) => {
  // 호가창 표시 개수 제한: 현재가 기준 위아래 각각 10개씩 (총 21개)
  const DISPLAY_RANGE = 10
  const currentPriceIndex = prices.findIndex((p) => p === currentPrice)

  // 화면 중앙에 현재가를 고정하기 위한 데이터 준비
  const totalDisplayItems = DISPLAY_RANGE * 2 + 1 // 총 21개 (위 10개 + 현재가 1개 + 아래 10개)
  const centerPosition = DISPLAY_RANGE // 정확히 중앙 인덱스 (10)

  // 빈 배열로 초기화
  const displayPrices = new Array(totalDisplayItems).fill('')
  const displayBuyVolumes = new Array(totalDisplayItems).fill(0)
  const displaySellVolumes = new Array(totalDisplayItems).fill(0)

  // 현재가를 중앙에 배치
  displayPrices[centerPosition] = currentPrice
  displayBuyVolumes[centerPosition] = buyVolumes[currentPriceIndex] || 0
  displaySellVolumes[centerPosition] = sellVolumes[currentPriceIndex] || 0

  // 현재가 위쪽 최신 10개 호가 데이터 채우기
  for (let i = 1; i <= DISPLAY_RANGE; i++) {
    const sourceIndex = currentPriceIndex - i
    if (sourceIndex >= 0) {
      displayPrices[centerPosition - i] = prices[sourceIndex]
      displayBuyVolumes[centerPosition - i] = buyVolumes[sourceIndex] || 0
      displaySellVolumes[centerPosition - i] = sellVolumes[sourceIndex] || 0
    }
  }

  // 현재가 아래쪽 최신 10개 호가 데이터 채우기
  for (let i = 1; i <= DISPLAY_RANGE; i++) {
    const sourceIndex = currentPriceIndex + i
    if (sourceIndex < prices.length) {
      displayPrices[centerPosition + i] = prices[sourceIndex]
      displayBuyVolumes[centerPosition + i] = buyVolumes[sourceIndex] || 0
      displaySellVolumes[centerPosition + i] = sellVolumes[sourceIndex] || 0
    }
  }

  const currentDisplayIndex = centerPosition // 현재가는 항상 중앙(10번 인덱스)에 위치

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
        // 고정된 간격을 위한 설정
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
          interval: 0, // 모든 라벨 표시
          formatter: (value, index) => {
            if (!value) return '' // 빈 데이터는 표시하지 않음

            if (index === currentDisplayIndex) return `{highlight|${value}}`
            else if (displayBuyVolumes[index] > 0) return `{blue|${value}}`
            else if (displaySellVolumes[index] > 0) return `{red|${value}}`
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
        barWidth: '80%', // 비율로 설정하여 일정한 크기 유지
        barMaxWidth: 40,
        itemStyle: {
          color: '#cce5ff',
          borderRadius: [4, 4, 4, 4],
        },
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
        itemStyle: {
          color: '#fbd5d5',
          borderRadius: [4, 4, 4, 4],
        },
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
