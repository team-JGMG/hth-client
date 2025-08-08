// 지분 거래 API (주문, 호가창, 거래 내역, 실시간 호가 등)
// src/api/trade.js
import api from '@/libs/axios'

// 주문 생성 API
export const createOrder = (payload) => {
  return api.post('/api/orders', payload)
}

//  @param {number} userId - 사용자 ID (path param)
//  @param {('BUY'|'SELL')=} orderType - 선택: 주문 타입 필터
//  @returns {Promise<Array>}

//거래 주문 내역 조회
export const getOrderHistory = async (userId, orderType) => {
  const params = {}
  if (orderType) params.orderType = orderType
  const { data } = await api.get(`/api/orders/history/${userId}`, { params })
  return data
}
