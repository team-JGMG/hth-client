export const mockOrderbook = [
  { price: '2,195', buyVolume: 72, sellVolume: 0 },
  { price: '2,190', buyVolume: 38, sellVolume: 0 },
  { price: '2,185', buyVolume: 58, sellVolume: 0 },

  { price: '2,180', buyVolume: 58, sellVolume: 0 },
  { price: '2,175', buyVolume: 96, sellVolume: 0 },
  { price: '2,170', buyVolume: 40, sellVolume: 0 },
  { price: '2,165', buyVolume: 8, sellVolume: 0 },
  { price: '2,160', buyVolume: 10, sellVolume: 0 },
  { price: '2,150', buyVolume: 100, sellVolume: 0 },
  { price: '2,175', buyVolume: 0, sellVolume: 30 },
  { price: '1,975', buyVolume: 0, sellVolume: 60 },
  { price: '1,980', buyVolume: 0, sellVolume: 20 },
  { price: '1,985', buyVolume: 0, sellVolume: 10 },
  { price: '1,990', buyVolume: 0, sellVolume: 30 },
  { price: '1,995', buyVolume: 0, sellVolume: 20 },
]

// 현재 가격
export const currentPrice = '2,150'

export function parseOrderbookData(orderbook) {
  const prices = orderbook.map((item) => item.price)
  const buyVolumes = orderbook.map((item) => item.buyVolume)
  const sellVolumes = orderbook.map((item) => item.sellVolume)
  return { prices, buyVolumes, sellVolumes }
}
