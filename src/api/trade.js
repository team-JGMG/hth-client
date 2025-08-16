// 지분 거래 API (주문, 호가창, 거래 내역, 실시간 호가 등)
// src/api/trade.js
import api from '@/libs/axios'

// 주문 생성 API (BUY/SELL)
export const createOrder = (payload, type) => {
  const upperType = String(type).toUpperCase()
  if (upperType !== 'BUY' && upperType !== 'SELL') {
    throw new Error(`Invalid order type: ${type} (must be 'BUY' or 'SELL')`)
  }

  return api.post('/api/auth/orders', payload)
}

//거래 주문 내역 조회
export function getOrderHistory(page = 0, size = 5, opts = {}) {
  // opts: { orderType: 'BUY' | 'SELL', sort: 'createdAt,desc', … }
  const params = { page, size, ...opts }
  // 디버깅용
  // console.log('[getOrderHistory] params =>', params)
  return api.get('/api/auth/orders', { params })
}
// 공용 성공판정
function isOk({ status, data }) {
  if (String(status).startsWith('2')) return true
  const s = (data?.status || data?.result || '').toString().toLowerCase()
  const c = data?.code
  return s === 'success' || c === 200 || c === '200' || c === 'OK' || c === 'Success'
}

// 아주 자세한 로그 + 3단계 폴백
export const cancelOrder = async (orderId) => {
  console.log('[cancelOrder] start, orderId =', orderId)

  let lastErr

  // 1) PATCH /api/orders/:id (no body)
  try {
    console.log('[cancelOrder] try #1 PATCH /api/orders/%s', orderId)
    const r1 = await api.patch(`/api/auth/orders/${orderId}`, null, { withCredentials: true })
    console.log('[cancelOrder] #1 response:', r1?.status, r1?.data)
    if (isOk(r1)) return r1.data
  } catch (e) {
    console.warn('[cancelOrder] #1 failed:', e?.response?.status, e?.response?.data, e)
    lastErr = e
  }

  // 2) PATCH /api/orders/:id/cancel
  try {
    console.log('[cancelOrder] try #2 PATCH /api/orders/%s/cancel', orderId)
    const r2 = await api.patch(`/api/auth/orders/${orderId}/cancel`, null, {
      withCredentials: true,
    })
    console.log('[cancelOrder] #2 response:', r2?.status, r2?.data)
    if (isOk(r2)) return r2.data
  } catch (e) {
    console.warn('[cancelOrder] #2 failed:', e?.response?.status, e?.response?.data, e)
    lastErr = e
  }

  // 3) PATCH /api/orders/:id { status: 'CANCELLED' }
  try {
    console.log('[cancelOrder] try #3 PATCH /api/orders/%s with body', orderId)
    const r3 = await api.patch(
      `/api/auth/orders/${orderId}`,
      { status: 'CANCELLED' },
      { withCredentials: true },
    )
    console.log('[cancelOrder] #3 response:', r3?.status, r3?.data)
    if (isOk(r3)) return r3.data
  } catch (e) {
    console.warn('[cancelOrder] #3 failed:', e?.response?.status, e?.response?.data, e)
    lastErr = e
  }

  console.error('[cancelOrder] all attempts failed')
  const err = new Error(lastErr?.response?.data?.message || '주문 취소 실패')
  err.response = lastErr?.response
  throw err
}
