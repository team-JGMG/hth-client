// 매물 api(등록, 조회, 삭제)

import api from '@/libs/axios'

export const registerPropertyWithFormData = async ({
  requestData,
  photoFiles,
  documentFiles,
  documentTypes,
}) => {
  // 1. 날짜 변환 (LocalDate 호환)
  const formatDate = (value) => {
    if (!value) return null
    const d = new Date(value)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const finalData = {
    ...requestData,
    approvalDate: formatDate(requestData.approvalDate),
  }

  // 2. FormData 생성
  const formData = new FormData()

  // JSON -> Blob(application/json) 변환
  const requestBlob = new Blob([JSON.stringify(finalData)], {
    type: 'application/json',
  })
  formData.append('request', requestBlob)

  // 3. 파일 첨부
  photoFiles.forEach((file) => {
    formData.append('photoFiles', file)
  })

  documentFiles.forEach((file) => {
    formData.append('documentFiles', file)
  })

  // 4. documentTypes JSON Blob으로 담기
  const documentTypesBlob = new Blob([JSON.stringify(documentTypes)], {
    type: 'application/json',
  })
  formData.append('documentTypes', documentTypesBlob)

  // 5. 요청 전송
  return api.post('/api/auth/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 매물 목록 조회
export const fetchUserProperties = async () => {
  try {
    const statuses = ['pending', 'approved', 'rejected', 'sold']
    const allResults = await Promise.all(
      statuses.map((status) =>
        api.get(`/api/auth/property/user`, {
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

// 주소 기반 좌표 변환 (스웨거 우선: POST /api/property/map/coordinate, body = JSON 문자열)
// 404면 서버 배포 상태가 달라진 것이니 GET ?address=... 으로 폴백
export const getCoordinatesByAddress = async (address) => {
  try {
    const { data } = await api.post('/api/property/map/coordinate', JSON.stringify(address), {
      headers: { 'Content-Type': 'application/json' },
    })
    return data // { latitude, longitude }
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get('/api/property/map/coordinate', { params: { address } })
      return data
    }
    throw e
  }
}
export const getPropertyDetail = async (fundingId) => {
  const { data } = await api.get(`/api/funding/${fundingId}`) // 실제 경로 다르면 수정
  return data
}

export const fetchUserPropertiesByStatus = async ({ status, page = 0, size = 10 }) => {
  const { data } = await api.get('/api/auth/property/user', {
    params: { page, size, status },
  })
  return {
    content: data?.data?.content ?? [],
    last: !!data?.data?.last,
  }
}
