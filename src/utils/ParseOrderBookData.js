export function parseOrderbookData(orderBookResponse) {
  const {
    currentPrice,
    upperLimitPrice,
    lowerLimitPrice,
    buyOrders = [],
    sellOrders = [],
  } = orderBookResponse

  const toNum = (v) => (typeof v === 'number' ? v : Number(v))
  const cp = toNum(currentPrice)

  // 매수: 내림차순
  const buyList = buyOrders
    .map(({ price, quantity }) => ({ price: toNum(price), buy: toNum(quantity), sell: 0 }))
    .sort((a, b) => b.price - a.price)
    .slice(0, 10)

  // 매도: 오름차순
  const sellList = sellOrders
    .map(({ price, quantity }) => ({ price: toNum(price), buy: 0, sell: toNum(quantity) }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 10)

  // 현재가
  const center = { price: cp, buy: 0, sell: 0 }

  // 중복 가격 병합
  const mergeMap = new Map()
  ;[...buyList, center, ...sellList].forEach(({ price, buy, sell }) => {
    const prev = mergeMap.get(price) || { price, buy: 0, sell: 0 }
    mergeMap.set(price, { price, buy: prev.buy + buy, sell: prev.sell + sell })
  })

  // ✅ 마지막에 '축 기준'으로 한 번 더 정렬(권장: 오름차순)
  const ordered = Array.from(mergeMap.values()).sort((a, b) => a.price - b.price)

  return {
    prices: ordered.map((p) => p.price), // yAxis(또는 category) 는 이 배열만 사용
    buyVolumes: ordered.map((p) => p.buy),
    sellVolumes: ordered.map((p) => p.sell),
    currentPrice: cp,
    upperLimitPrice: toNum(upperLimitPrice),
    lowerLimitPrice: toNum(lowerLimitPrice),
  }
}
