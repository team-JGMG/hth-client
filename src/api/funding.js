// //임시 목데이터 사용

// import { mockFundingList } from '@/mocks/fundingListMock'

// export const getFundingList = async (category, sort = 'date') => {
//   let list = [...mockFundingList]

//   // 1. 필터: category
//   const statusMap = {
//     funding: '모집 중',
//     ended: '펀딩 완료',
//     sold: '매각 완료',
//   }
//   if (category && statusMap[category]) {
//     list = list.filter((item) => item.status === statusMap[category])
//   }

//   // 2. 정렬: sort
//   if (sort === 'timeLeft') {
//     list.sort((a, b) => a.daysLeft - b.daysLeft)
//   } else if (sort === 'rate') {
//     list.sort((a, b) => b.fundingRate - a.fundingRate)
//   } else {
//     list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//   }

//   return Promise.resolve({ data: list })
// }
// src/api/funding.js
import axios from '@/libs/axios' // ← 프로젝트에 설정된 axios 인스턴스 사용

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
