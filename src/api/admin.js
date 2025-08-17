import api from '@/libs/axios'

export const fetchPropertyList = async (category = 'pending', page = 0, size = 10) => {
  const res = await api.get('/api/auth/properties', {
    params: { category, page, size },
  })
  return res.data.data
}

export const fetchPropertyDetail = async (propertyId) => {
  const res = await api.get(`/api/auth/properties/${propertyId}`)
  return res.data
}

export const approveProperty = (id) => {
  return api.patch(`/api/auth/properties/${id}/status`, {
    status: 'approved',
  })
}

export const rejectProperty = (id) => {
  return api.patch(`/api/auth/properties/${id}/status`, {
    status: 'rejected',
  })
}
