// 지분 거래 API (주문, 호가창, 거래 내역, 실시간 호가 등)
import api from '@/libs/axios'

// 주문 생성 API
export const createOrder = (payload) => {
  return api.post('/api/orders', payload)
}
