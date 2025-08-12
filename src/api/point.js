// 포인트/결제 api
// src/api/payment.js

import api from '@/libs/axios'

// merchant_uid 발급
export const requestChargeMerchantUid = async (amount) => {
  const res = await api.post('/api/auth/point/charge', null, {
    params: { amount: Number(amount) },
    withCredentials: true,
  })
  return res.data.data
}

// 결제 검증
export const verifyPayment = async ({ impUid, amount, merchantUid }) => {
  const res = await api.post(
    '/api/auth/point/verify',
    { impUid, amount, merchantUid },
    { withCredentials: true },
  )
  return res.data
}

// 현재 포인트 보유량 조회
export const getPointBalance = async () => {
  const res = await api.get('/api/auth/point/balance', {
    withCredentials: true,
  })
  return res.data.data
}

// 포인트 환급 요청
export const requestPointRefund = async ({ amount }) => {
  const res = await api.post(
    '/api/auth/point/refund',
    { amount: Number(amount) },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    },
  )
  return res.data.data
}
// 포인트 입출금 내역 조회 (테스트용 엔드포인트 사용)
export const getPointTransactions = async ({
  page = 0,
  size = 100,
  sort = 'createdAt,DESC',
} = {}) => {
  try {
    const params = { page, size, sort }

    // ⚠️ 여기 경로가 핵심
    const res = await api.get('/api/auth/point/transactions', { params })
    if (!Array.isArray(res?.data?.data)) {
      throw new Error(res?.data?.message || '포인트 내역 응답 형식 오류')
    }
    return res.data.data
  } catch (err) {
    const status = err?.response?.status
    const body = err?.response?.data
    const msg =
      (body && (body.message || body.error || JSON.stringify(body))) ||
      err.message ||
      '알 수 없는 오류'
    const wrapped = new Error(`[${status}] ${msg}`)
    wrapped.original = err
    throw wrapped
  }
}
