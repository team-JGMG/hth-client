// 펀딩 api
// src/api/funding.js

import api from '@/libs/axios'

// 펀딩 목록
export const getFundingList = async (category, sort = 'date', page = 0, size = 20) => {
  return api.get('/api/funding', {
    params: {
      category,
      sort,
      page,
      size,
    },
  })
}

// 특정유저 펀딩 주문 목록 조회
export const getUserFundingOrders = (userId, status = 'pending', page = 0, size = 10) => {
  return api.get(`/api/funding-order/${userId}`, {
    params: {
      status,
      page,
      size,
    },
  })
}

//  특정유저 보유 지분 목록 조회
export const getUserShares = (userId, page = 0, size = 10) => {
  return api.get(`/api/shares/users/${userId}`, {
    params: { page, size },
  })
}

// 환불(주문 취소)
export const refundFundingOrder = (fundingId, orderId, orderPrice) => {
  return api.post('/api/funding-order/refund', null, {
    params: { fundingId, orderId, orderPrice },
    withCredentials: true, // 쿠키 인증이면 유지
  })
}

// 배당금(allocations) 조회
export const getAllocations = (fundingId) => {
  return api.get(`/api/allocations/${fundingId}`, { withCredentials: true })
}

// 거래 리스트 페이지
export const getEndedFundings = async (page = 0, size = 10) => {
  return api.get('/api/funding/ended', {
    params: { page, size },
  })
}

// 거래 상세 페이지
export const getFundingById = (id) => {
  return api.get(`/api/funding/${id}`)
}

// 거래 체결 내역
export const getFundingTradeHistory = async (fundingId) => {
  const res = await api.get(`/api/fundings/${fundingId}/trades`, {
    params: {
      startDate: '2025-06-01',
      endDate: '2025-06-20',
      limit: 100,
      offset: 0,
    },
  })
  return res.data.data?.history || []
}
