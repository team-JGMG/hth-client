// 지분 거래 API (주문, 호가창, 거래 내역, 실시간 호가 등)
import api from '@/libs/axios'

// 주문 생성 API
export const createOrder = (payload) => {
  return api.post('/api/orders', payload)
}

/**
 * 거래 주문 내역 조회
 * @param {number} userId - 사용자 ID (path param)
 * @param {('BUY'|'SELL')=} orderType - 선택: 주문 타입 필터
 * @returns {Promise<Array>}
 */
export const getOrderHistory = async (userId, orderType) => {
  const params = {}
  if (orderType) params.orderType = orderType
  const { data } = await api.get(`/api/orders/history/${userId}`, { params })
  // 여기서 data는 서버가 주는 '바로 그 data' (배열일 수도, 객체 래핑일 수도 있음)
  return data
}
