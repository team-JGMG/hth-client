import api from '@/libs/axios'

export async function getFundingOrderLimit(fundingId) {
  const f = Number(fundingId)
  const { data } = await api.get('/api/auth/funding-orders/limit', {
    params: { fundingId: f },
  })
  const body = data?.data ?? data ?? {}
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

  const url = `/api/auth/funding-orders?fundingId=${f}&shareCount=${s}`
  try {
    const { data } = await api.post(url)
    const ok = data?.status === 'success' || data?.code === 'SUCCESS' || data?.result === true

    const message = data?.message ?? data?.data?.message
    const body = data?.data ?? data

    return { ok, message, data: body }
  } catch {
    throw new Error()
  }
}
