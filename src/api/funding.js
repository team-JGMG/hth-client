import api from '@/libs/axios'

export const getFundingList = async (category, sort = 'date', page = 0, size = 20) => {
  return api.get('/api/fundings', {
    params: {
      category,
      sort,
      page,
      size,
    },
  })
}

export const getUserFundingOrders = (status = 'pending', page = 0, size = 10) => {
  return api.get(`/api/auth/funding-orders`, {
    params: {
      status,
      page,
      size,
    },
  })
}

export const getUserShares = (page = 0, size = 10) => {
  return api.get(`/api/auth/shares`, {
    params: { page, size },
  })
}

export const refundFundingOrder = (fundingId, orderId, orderPrice) => {
  const params = {
    fundingId: Number.parseInt(fundingId, 10),
    orderId: Number.parseInt(orderId, 10),
    orderPrice: Number(orderPrice),
  }

  return api.post('/api/auth/funding-orders/refund', null, {
    params,
    withCredentials: true,
  })
}

export const getAllocations = (fundingId) => {
  return api.get(`/api/allocations/${fundingId}`, { withCredentials: true })
}

export const getEndedFundings = async (page = 0, size = 10) => {
  return api.get('/api/fundings/ended', {
    params: { page, size },
  })
}

export const getFundingById = async (id) => {
  const res = await api.get(`/api/fundings/${id}`)
  return res
}

export const getFundingTradeHistory = async (fundingId) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const endDate = yesterday.toISOString().split('T')[0]

  const lastYear = new Date(yesterday)
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  const startDate = lastYear.toISOString().split('T')[0]

  const res = await api.get(`/api/fundings/${fundingId}/trades`, {
    params: {
      startDate,
      endDate,
      limit: 100,
      offset: 0,
    },
  })

  return res.data.data?.history || []
}
