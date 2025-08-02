import axios from '@/libs/axios'
/**
 * 펀딩 목록 API 호출
 * @param {string} category - funding | ended | sold
 * @param {string} sort - date | timeLeft | rate
 * @param {number} page - 기본값: 0
 * @param {number} size - 기본값: 20
 */
export const getFundingList = async (category, sort = 'date', page = 0, size = 20) => {
  return axios.get('/api/funding', {
    params: {
      category,
      sort,
      page,
      size,
    },
  })
}

// 거래 리스트 페이지
export const fetchEndedFundings = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/funding/ended', {
      params: { page, size },
    })
    return response.data?.data?.content || [] // ← Swagger 응답 구조에 따라 .data?.data 가능
  } catch (error) {
    console.error('성공 펀딩 목록 조회 실패:', error)
    return []
  }
}
