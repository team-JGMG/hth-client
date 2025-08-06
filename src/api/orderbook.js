import axios from '@/libs/axios'
import { useTradeStore } from '@/stores/tradeStore'

export const fetchOrderBookByFundingId = async (fundingId) => {
  console.log('✅ fetchOrderBookByFundingId 호출됨, fundingId:', fundingId)

  try {
    const response = await axios.get(`/api/order-books/${fundingId}`)
    console.log('📦 response:', response)

    const raw = response.data?.data
    console.log('[1] 받은 데이터:', raw)

    const orderBookData = raw?.orderBook || raw
    console.log('[2] 전달할 orderBookData:', orderBookData)

    const tradeStore = useTradeStore()
    tradeStore.setTradeData(orderBookData)
  } catch (error) {
    console.error('❌ 주문서 데이터 가져오기 실패:', error)
  }
}
