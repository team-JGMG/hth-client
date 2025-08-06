// 매물 자료/사진 업로드 api
import api from '@/libs/axios'

export const uploadPropertyWithFiles = async (formData) => {
  return api.post('/api/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
