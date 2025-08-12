// 펀딩하기 펀딩거래 API
// src/api/fundingtrade.js
import api from '@/libs/axios'

export async function getFundingOrderLimit(fundingId) {
  const f = Number(fundingId)
  const { data } = await api.get('/api/auth/funding-order/limit', {
    params: { fundingId: f },
  })
  const body = data?.data ?? data ?? {}
  // 숫자 정규화(선택)
  return {
    ...body,
    remainingAmount: Number(body.remainingAmount ?? 0),
    remainingShares: Number(body.remainingShares ?? 0),
    shareAmount: Number(body.shareAmount ?? body.currentShareAmount ?? 0),
    userPoints: Number(body.userPoints ?? 0),
    userShareCount: Number(body.userShareCount ?? 0),
  }
}

export async function createFundingOrder({ fundingId, shareCount }) {
  const f = Number(fundingId)
  const s = Number(shareCount)

  const url = `/api/auth/funding-order?fundingId=${f}&shareCount=${s}`
  try {
    const { data } = await api.post(url)
    // ✅ 성공 판정 통일
    const ok = data?.status === 'success' || data?.code === 'SUCCESS' || data?.result === true

    const message = data?.message ?? data?.data?.message
    const body = data?.data ?? data

    // (디버그) 필요시 남겨두기
    console.log('[ORDER][RES][raw]', data)
    console.log('[ORDER][RES][normalized]', { ok, message, data: body })

    // ✅ 표준화된 형태로 반환
    return { ok, message, data: body }
  } catch (err) {
    console.log('[ORDER][ERR]', {
      url,
      status: err?.response?.status,
      data: err?.response?.data || err?.message,
    })
    throw err
  }
}
