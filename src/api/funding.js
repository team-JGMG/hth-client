// api/funding.js
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
    return response.data?.data?.content || []
  } catch (error) {
    console.error('성공 펀딩 목록 조회 실패:', error)
    return []
  }
}

/**
 * 특정 펀딩의 거래 내역을 불러옵니다.
 * @param {number|string} fundingId
 * @returns {Promise<object[]>} history array
 */
export async function fetchTradeHistory(fundingId) {
  try {
    const res = await axios.get(`/api/fundings/${fundingId}/trades`)
    return res.data?.data?.history || []
  } catch (err) {
    console.error('[fetchTradeHistory] API 호출 실패:', err)
    return []
  }
}

/**
 * 펀딩 거래 내역 조회 (차트용)
 * @param {string|number} fundingId - 펀딩 ID
 * @returns {Promise<Object>} API 응답 데이터
 */
export const getFundingTrades = async (fundingId) => {
  try {
    const response = await axios.get(`/api/fundings/${fundingId}/trades`)
    return response.data?.data || response.data
  } catch (error) {
    console.error('펀딩 거래 내역 조회 실패:', error)
    throw error
  }
}

/**
 * 차트 데이터 변환 함수
 * @param {Array} apiData - API에서 받은 원본 데이터
 * @returns {Object} 차트에 사용할 변환된 데이터
 */
export const transformChartData = (apiData) => {
  // API 응답이 배열인지 확인하고, history 배열이 있는지 확인
  const chartData = Array.isArray(apiData) ? apiData : apiData.history || []

  if (!chartData.length) {
    throw new Error('차트 데이터가 없습니다.')
  }

  // API 데이터를 차트 형식으로 변환
  const times = chartData.map((d) => d.date)
  const prices = chartData.map((d) => d.closingPrice)
  const volumes = chartData.map((d) => d.volume)

  // 가격 변화율 계산 (이전 데이터와 비교)
  const priceChanges = chartData.map((d, index) => {
    if (index === 0) return 0
    const prevPrice = chartData[index - 1].closingPrice
    const currentPrice = d.closingPrice
    return (((currentPrice - prevPrice) / prevPrice) * 100).toFixed(2)
  })

  const max = Math.max(...prices)
  const min = Math.min(...prices)

  return {
    times,
    prices,
    volumes,
    priceChanges,
    max,
    min,
    rawData: chartData,
  }
}

/**
 * 펀딩 차트 데이터 조회 (API 호출 + 데이터 변환)
 * @param {string|number} fundingId - 펀딩 ID
 * @returns {Promise<Object>} 변환된 차트 데이터
 */
export const getFundingChartData = async (fundingId) => {
  try {
    const apiData = await getFundingTrades(fundingId)
    const chartData = transformChartData(apiData)
    return chartData
  } catch (error) {
    console.error('펀딩 차트 데이터 조회 실패:', error)
    throw error
  }
}
