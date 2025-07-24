export const mockOrderbook = [
  { price: '2,175', buyVolume: 96, sellVolume: 0 },

  { price: '2,170', buyVolume: 40, sellVolume: 0 },
  { price: '2,165', buyVolume: 8, sellVolume: 0 },
  { price: '2,160', buyVolume: 10, sellVolume: 0 },
  { price: '2,150', buyVolume: 100, sellVolume: 0 },
  { price: '2,175', buyVolume: 0, sellVolume: 30 },
  { price: '1,975', buyVolume: 0, sellVolume: 60 },
  { price: '1,980', buyVolume: 0, sellVolume: 20 },
  { price: '1,985', buyVolume: 0, sellVolume: 10 },
]

// 현재 가격
export const currentPrice = '2,150'

export function parseOrderbookData(orderbook) {
  const prices = orderbook.map((item) => item.price)
  const buyVolumes = orderbook.map((item) => item.buyVolume)
  const sellVolumes = orderbook.map((item) => item.sellVolume)
  return { prices, buyVolumes, sellVolumes }
}
