import axios from '@/libs/axios'
import { useTradeStore } from '@/stores/tradeStore'

export const fetchOrderBookByFundingId = async (fundingId) => {
  try {
    const response = await axios.get(`/api/order-books/${fundingId}`)
    const tradeStore = useTradeStore()
    tradeStore.setTradeData(response.data.data)
  } catch (error) {
    console.error('주문서 데이터 가져오기 실패:', error)
  }
}
