import api from '@/libs/axios'

//  @param {number|string} fundingId
//  @returns {Promise}
export const getOrderBookByFundingId = (fundingId) => {
  return api.get(`/api/order-books/${fundingId}`)
}
