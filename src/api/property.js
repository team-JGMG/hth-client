// 매물 api(등록, 조회, 삭제)

import api from '@/libs/axios'

// 매물 등록 (multipart/form-data 방식)
export const registerPropertyWithFormData = async ({
  requestData,
  photoFiles,
  documentFiles,
  documentTypes,
}) => {
  const formData = new FormData()

  const requestBlob = new Blob([JSON.stringify(requestData)], {
    type: 'application/json',
  })
  formData.append('request', requestBlob)

  photoFiles.forEach((file) => {
    formData.append('photoFiles', file)
  })

  documentFiles.forEach((file) => {
    formData.append('documentFiles', file)
  })

  documentTypes.forEach((type) => {
    formData.append('documentTypes', type)
  })

  return api.post('/api/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 매물 목록 조회
export const fetchUserProperties = async (userId) => {
  try {
    const statuses = ['pending', 'approved', 'rejected', 'sold']
    const allResults = await Promise.all(
      statuses.map((status) =>
        api.get(`/api/property/user/${userId}`, {
          params: {
            page: 0,
            size: 10,
            status,
          },
        }),
      ),
    )

    const merged = allResults.flatMap((res) => res.data?.data?.content || [])

    return merged
  } catch (error) {
    console.error('매물 조회 실패:', error)
    throw error
  }
}

// 매각 완료된 매물 목록 조회 (메인용)
export const getSoldProperties = async () => {
  const response = await api.get('/api/property/sold')
  console.log('API Response:', response)
  return response.data
}

// 매물 ID 기반 실거래가 위치 정보 조회
export const getPropertyMapData = async (propertyId) => {
  const response = await api.get(`/api/property/map/${propertyId}`)
  return response.data
}

// 매물 ID 기반 좌표 조회
export const getPropertyCoordinates = async (propertyId) => {
  const response = await api.get(`/api/property/map/coordinate/${propertyId}`)
  return response.data
}
