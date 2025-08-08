// 관리자용 api
// src/api/admin.js

import api from '@/libs/axios'

// 매물 목록 조회
export const fetchPropertyList = async (category = 'pending', page = 0, size = 10) => {
  const res = await api.get('/api/property', {
    params: { category, page, size },
  })
  return res.data.data
}

// 매물 상세 조회
export const fetchPropertyDetail = async (propertyId) => {
  const res = await api.get(`/api/property/${propertyId}`)
  return res.data
}

//매물 승인
export const approveProperty = (id) => {
  return api.patch(`/api/property/${id}/status`, {
    status: 'approved',
  })
}

//매물 거절
export const rejectProperty = (id) => {
  return api.patch(`/api/property/${id}/status`, {
    status: 'rejected',
  })
}
