// 매물 api(등록, 조회, 삭제)

import api from '@/libs/axios'

// ✅ 매물 등록 (multipart/form-data 방식)
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

    // 응답에서 각각의 데이터(content)만 추출하여 하나의 배열로 합치기
    const merged = allResults.flatMap((res) => res.data?.data?.content || [])

    return merged
  } catch (error) {
    console.error('매물 조회 실패:', error)
    throw error
  }
}
