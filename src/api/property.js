// 매물 api(등록, 조회, 삭제)

import api from '@/libs/axios' // axios 인스턴스를 가져옴

//매물 등록 post
export const registerProperty = async (data) => {
  return api.post('/api/property', data)
}

//사용자 매물 조회
export const fetchUserProperties = async (userId) => {
  try {
    const statuses = ['PENDING', 'approved', 'rejected', 'sold']
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

    // 응답에서 각각의 데이터(content)만 추출하여 하나의 배열로 합치기
    const merged = allResults.flatMap((res) => res.data?.data?.content || [])

    return merged
  } catch (error) {
    console.error('매물 조회 실패:', error)
    throw error
  }
}
