import axios from '@/libs/axios'

//   펀딩 목록 API 호출
//  @param {string} category - funding | ended | sold
//   @param {string} sort - date | timeLeft | rate
//   @param {number} page - 기본값: 0
//   @param {number} size - 기본값: 20

export const getFundingList = async (category, sort = 'date', page = 0, size = 20) => {
  return axios.get('/api/funding', {
    params: {
      category,
      sort,
      page,
      size,
    },
  })
}
export const getUserFundingOrders = (userId, status = 'pending', page = 0, size = 10) => {
  return axios.get(`/api/funding-order/${userId}`, {
    params: {
      status,
      page,
      size,
    },
  })
}
/**
 * 특정 유저의 보유 지분 목록 조회
 */
export const getUserShares = (userId, page = 0, size = 10) => {
  return axios.get(`/api/shares/users/${userId}`, {
    params: { page, size },
  })
}

// 환불(주문 취소)
export const refundFundingOrder = (fundingId, orderId, orderPrice) => {
  // Swagger에 따르면 query 파라미터로 보냄
  return axios.post('/api/funding-order/refund', null, {
    params: { fundingId, orderId, orderPrice },
    withCredentials: true, // 쿠키 인증이면 유지
  })
}
// 배당금(allocations) 조회
export const getAllocations = (fundingId) => {
  return axios.get(`/api/allocations/${fundingId}`, { withCredentials: true })
}
