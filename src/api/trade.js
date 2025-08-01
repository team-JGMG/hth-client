// 지분 거래 API (주문, 호가창, 거래 내역, 실시간 호가 등)
import axios from 'axios'

// 주문 생성 API
export const createOrder = (payload) => {
  return axios.post('/api/orders', payload)
}
