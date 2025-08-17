import api from '@/libs/axios'

export const requestChargeMerchantUid = async (amount) => {
  const res = await api.post('/api/auth/points/charge', null, {
    params: { amount: Number(amount) },
    withCredentials: true,
  })
  return res.data.data
}

export const verifyPayment = async ({ impUid, amount, merchantUid }) => {
  const res = await api.post(
    '/api/auth/points/verify',
    { impUid, amount, merchantUid },
    { withCredentials: true },
  )
  return res.data
}

export const getPointBalance = async () => {
  const res = await api.get('/api/auth/points/balance', {
    withCredentials: true,
  })
  return res.data.data
}

export const requestPointRefund = async ({ amount }) => {
  const res = await api.post(
    '/api/auth/points/refund',
    { amount: Number(amount) },
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    },
  )
  return res.data.data
}
export const getPointTransactions = async ({
  page = 0,
  size = 100,
  sort = 'createdAt,DESC',
} = {}) => {
  try {
    const params = { page, size, sort }

    const res = await api.get('/api/auth/points/transactions', { params })
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
