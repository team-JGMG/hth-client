// src/api/allocation.js
import api from '@/libs/axios'

/**
 * 펀딩 배당금 내역 조회
 * GET /api/allocations/{fundingId}
 */
export const getAllocations = (fundingId) => {
  return api.get(`/api/allocations/${fundingId}`, {
    withCredentials: true,
  })
}

/**
 * 응답에서 리스트만 추출 (배열/페이지네이션 모두 대응)
 */
export const unwrapAllocations = (res) => {
  const root = res?.data
  return Array.isArray(root?.data?.content)
    ? root.data.content
    : Array.isArray(root?.data)
      ? root.data
      : Array.isArray(root)
        ? root
        : []
}
