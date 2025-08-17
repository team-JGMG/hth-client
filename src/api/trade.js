import api from '@/libs/axios'

export const createOrder = (payload, type) => {
  const upperType = String(type).toUpperCase()
  if (upperType !== 'BUY' && upperType !== 'SELL') {
    throw new Error(`Invalid order type: ${type} (must be 'BUY' or 'SELL')`)
  }
  return api.post('/api/auth/orders', payload)
}

export function getOrderHistory(page = 0, size = 5, opts = {}) {
  const params = { page, size, ...opts }
  return api.get('/api/auth/orders', { params })
}

function isOk({ status, data }) {
  if (String(status).startsWith('2')) return true
  const s = (data?.status || data?.result || '').toString().toLowerCase()
  const c = data?.code
  return s === 'success' || c === 200 || c === '200' || c === 'OK' || c === 'Success'
}

export const cancelOrder = async (orderId) => {
  let lastErr

  try {
    const r1 = await api.patch(`/api/auth/orders/${orderId}`, null, { withCredentials: true })
    if (isOk(r1)) return r1.data
  } catch (e) {
    lastErr = e
  }

  try {
    const r2 = await api.patch(`/api/auth/orders/${orderId}/cancel`, null, {
      withCredentials: true,
    })
    if (isOk(r2)) return r2.data
  } catch (e) {
    lastErr = e
  }

  try {
    const r3 = await api.patch(
      `/api/auth/orders/${orderId}`,
      { status: 'CANCELLED' },
      { withCredentials: true },
    )
    if (isOk(r3)) return r3.data
  } catch (e) {
    lastErr = e
  }

  const err = new Error(lastErr?.response?.data?.message || '주문 취소 실패')
  err.response = lastErr?.response
  throw err
}
