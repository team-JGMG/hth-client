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
export const getUserFundingOrders = (status = 'pending', page = 0, size = 10) => {
  return api.get(`/api/auth/funding-order`, {
    params: {
      status,
      page,
      size,
    },
  })
}

//  특정유저 보유 지분 목록 조회
export const getUserShares = (page = 0, size = 10) => {
  return api.get(`/api/auth/shares`, {
    params: { page, size },
  })
}

// 환불(주문 취소)
// 환불(주문 취소)
export const refundFundingOrder = (fundingId, orderId, orderPrice) => {
  // 모두 정수/숫자로 강제 변환
  const params = {
    fundingId: Number.parseInt(fundingId, 10),
    orderId: Number.parseInt(orderId, 10),
    orderPrice: Number(orderPrice), // 금액 소수 없음이면 parseInt로 바꿔도 됨
  }

  // 로깅(개발 중에만)
  if (import.meta.env.DEV) {
    console.log('[refundFundingOrder] params =', params)
  }

  return api.post('/api/auth/funding-order/refund', null, {
    params,
    withCredentials: true,
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
export const getFundingById = async (id) => {
  const res = await api.get(`/api/funding/${id}`)
  if (import.meta.env.DEV) console.log('[API] getFundingById raw', id, res.status, res.data)
  return res
}

// 거래 체결 내역
export const getFundingTradeHistory = async (fundingId) => {
  // 어제 날짜
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const endDate = yesterday.toISOString().split('T')[0] // YYYY-MM-DD

  // 1년 전 날짜
  const lastYear = new Date(yesterday)
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  const startDate = lastYear.toISOString().split('T')[0]

  const res = await api.get(`/api/fundings/${fundingId}/trades`, {
    params: {
      startDate, // endDate 기준 1년 전
      endDate, // 어제
      limit: 100,
      offset: 0,
    },
  })

  return res.data.data?.history || []
}
