// 포인트/결제 api
// src/api/payment.js

import api from '@/libs/axios'

// merchant_uid 발급
export const requestChargeMerchantUid = async (amount) => {
  const res = await api.post('/api/point/charge', null, {
    params: { amount },
  })
  return res.data.data
}

// 결제 검증
export const verifyPayment = async ({ impUid, amount }) => {
  const res = await api.post('/api/point/verify', { impUid, amount })
  return res.data
}

// 현재 포인트 보유량 조회
export const getPointBalance = async () => {
  const res = await api.get('/api/point/balance', {
    withCredentials: true,
  })
  return res.data.data
}
