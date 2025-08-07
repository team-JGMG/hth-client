import api from '@/libs/axios'

/**
 * 펀딩 ID로 현재 호가 정보 조회
 * @param {number|string} fundingId
 * @returns {Promise}
 */
export const getOrderBookByFundingId = (fundingId) => {
  return api.get(`/api/order-books/${fundingId}`)
}
