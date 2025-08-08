//호가 api
// src/api/orderbook.js

import api from '@/libs/axios'

//  @param {number|string} fundingId
//  @returns {Promise}

//현재 호가 정보 조회
export const getOrderBookByFundingId = (fundingId) => {
  return api.get(`/api/order-books/${fundingId}`)
}
