export function parseOrderbookData(orderBookResponse) {
  const { currentPrice, upperLimitPrice, lowerLimitPrice, buyOrders, sellOrders } =
    orderBookResponse

  const priceSet = new Set()
  buyOrders.forEach((order) => priceSet.add(Number(order.price)))
  sellOrders.forEach((order) => priceSet.add(Number(order.price)))
  if (currentPrice) {
    priceSet.add(Number(currentPrice))
  }
  const prices = Array.from(priceSet).sort((a, b) => a - b)

  const buyVolumeMap = Object.fromEntries(
    buyOrders.map((o) => [Number(o.price), Number(o.quantity)]),
  )
  const sellVolumeMap = Object.fromEntries(
    sellOrders.map((o) => [Number(o.price), Number(o.quantity)]),
  )

  const buyVolumes = prices.map((price) => buyVolumeMap[price] || 0)
  const sellVolumes = prices.map((price) => sellVolumeMap[price] || 0)

  return {
    prices,
    buyVolumes,
    sellVolumes,
    currentPrice: Number(currentPrice),
    upperLimitPrice: Number(upperLimitPrice),
    lowerLimitPrice: Number(lowerLimitPrice),
  }
}
