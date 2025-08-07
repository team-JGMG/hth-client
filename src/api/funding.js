import axios from '@/libs/axios'

//   펀딩 목록 API 호출
//  @param {string} category - funding | ended | sold
//   @param {string} sort - date | timeLeft | rate
//   @param {number} page - 기본값: 0
//   @param {number} size - 기본값: 20

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
