// 펀딩 api (정보 조회, 참여, 취소/환급)
import api from '@/lib/axios' // 또는 '@/axios' 경로에 따라 수정

/**
 * 성공한 펀딩 리스트 조회
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지당 항목 수 (기본값: 10)
 * @returns {Promise<Array>} 펀딩 목록 배열
 */
export const fetchEndedFundingList = async (page = 0, size = 10) => {
  const response = await api.get('/funding/ended', {
    params: { page, size },
  })
  return response.data
}
