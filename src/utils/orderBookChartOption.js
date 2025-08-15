import { labelStyles } from '@/components/constants/chartStyles'

export const generateOrderBookChartOption = ({ prices, buyVolumes, sellVolumes, currentPrice }) => {
  // ✅ 1) 방어코드: prices가 내림차순이 아니면 세 배열을 모두 뒤집어 정렬 일치
  const isDescending =
    Array.isArray(prices) && prices.length > 1
      ? Number(prices[0]) >= Number(prices[prices.length - 1])
      : true

  let p = prices?.slice() ?? []
  let b = buyVolumes?.slice() ?? []
  let s = sellVolumes?.slice() ?? []

  if (!isDescending) {
    p.reverse()
    b.reverse()
    s.reverse()
  }

  // 숫자 비교 안전성
  const currentPriceNum = Number(currentPrice)
  const currentPriceIndex = p.findIndex((v) => Number(v) === currentPriceNum)

  const maxVolume = Math.max(...b, ...s, 0)

  return {
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',

    grid: [
      { top: '0%', bottom: '0%', left: '0%', right: '60%', containLabel: false }, // 매도
      { top: '0%', bottom: '0%', left: '60%', right: '0%', containLabel: false }, // 매수
      { top: '0%', bottom: '0%', left: '52%', right: '50%', width: '10%', containLabel: false }, // 가격라벨
    ],

    // 좌/우 그리드는 가로 막대 방향만 다르게(좌측은 왼쪽으로, 우측은 오른쪽으로)
    xAxis: Array(3)
      .fill(0)
      .map((_, i) => ({
        type: 'value',
        position: 'top',
        inverse: i === 0, // 좌측(매도) 막대는 왼쪽으로 뻗게
        gridIndex: i,
        max: i < 2 ? maxVolume : null,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      })),

    // ✅ 2) 세 yAxis 모두 동일한 prices, 동일한 방향(inverse:false)
    yAxis: Array(3)
      .fill(0)
      .map((_, i) => ({
        type: 'category',
        gridIndex: i,
        inverse: true, // 큰 가격이 위로 보이게 (prices는 내림차순)
        data: p,
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
                  else if (b[index] > 0) return `{blue|${value}}`
                  else if (s[index] > 0) return `{red|${value}}`
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
        data: s, // ✅ 부모 정렬 기준과 동일 인덱스
        barWidth: 25,
        barCategoryGap: '60%',
        itemStyle: { color: '#fbd5d5', borderRadius: [12, 0, 0, 12] },
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
        data: b, // ✅ 부모 정렬 기준과 동일 인덱스
        barWidth: 25,
        barCategoryGap: '40%',
        itemStyle: { color: '#cce5ff', borderRadius: [0, 12, 12, 0] },
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
