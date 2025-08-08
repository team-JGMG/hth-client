export function parseOrderbookData(orderBookResponse) {
  const {
    currentPrice,
    upperLimitPrice,
    lowerLimitPrice,
    buyOrders = [],
    sellOrders = [],
  } = orderBookResponse

  const cp = Number(currentPrice)

  // ✅ 매수: 가격 내림차순 → 상단 → 최대 10개
  const buyList = buyOrders
    .map(({ price, quantity }) => ({
      price: Number(price),
      buy: Number(quantity),
      sell: 0,
    }))
    .sort((a, b) => b.price - a.price)
    .slice(0, 10)

  // ✅ 매도: 가격 오름차순 → 하단 → 최대 10개
  const sellList = sellOrders
    .map(({ price, quantity }) => ({
      price: Number(price),
      buy: 0,
      sell: Number(quantity),
    }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 10)

  // ✅ 현재가 (중앙)
  const center = {
    price: cp,
    buy: 0,
    sell: 0,
  }

  // ✅ 중복 가격 병합
  const mergeMap = new Map()

  ;[...buyList, center, ...sellList].forEach(({ price, buy, sell }) => {
    if (!mergeMap.has(price)) {
      mergeMap.set(price, { price, buy, sell })
    } else {
      const existing = mergeMap.get(price)
      mergeMap.set(price, {
        price,
        buy: existing.buy + buy,
        sell: existing.sell + sell,
      })
    }
  })

  const ordered = Array.from(mergeMap.values())

  return {
    prices: ordered.map((p) => p.price),
    buyVolumes: ordered.map((p) => p.buy),
    sellVolumes: ordered.map((p) => p.sell),
    currentPrice: cp,
    upperLimitPrice: Number(upperLimitPrice),
    lowerLimitPrice: Number(lowerLimitPrice),
  }
}
