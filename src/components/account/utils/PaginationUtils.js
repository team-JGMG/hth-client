// components/account/utils/PaginationUtils.js

/**
 * 리스트 콘텐츠를 꺼내는 공통 유틸.
 * 지원 형태:
 *  - { content: [...] }  // Spring Page
 *  - { items:   [...] }  // 흔한 리스트 래퍼
 *  - [ ... ]             // 순수 배열
 */
export function extractContent(data) {
  if (!data) return []
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data)) return data
  return []
}

/**
 * 다음 페이지 존재 여부를 최대한 보수적으로 추정.
 * 지원 신호:
 *  - hasNext / next / last
 *  - totalPages + (number | page)
 *  - totalElements
 *  - fallback: contentLen >= pageSize
 */
export function computeHasNext(data, contentLen, pageSize = 10) {
  const nextByFlags =
    (typeof data?.hasNext === 'boolean' && data.hasNext) ||
    (typeof data?.last === 'boolean' && data.last === false) ||
    (typeof data?.next === 'boolean' && data.next === true)

  const nextByPages =
    (typeof data?.totalPages === 'number' &&
      typeof data?.number === 'number' &&
      data.number + 1 < data.totalPages) ||
    (typeof data?.totalPages === 'number' &&
      typeof data?.page === 'number' &&
      data.page + 1 < data.totalPages)

  const nextByTotals =
    typeof data?.totalElements === 'number' &&
    data.totalElements > 0 &&
    data.totalElements > contentLen

  const fallback = contentLen >= pageSize

  return !!(nextByFlags || nextByPages || nextByTotals || fallback)
}

/**
 * 1페이지 응답이 pageSize 미만이어도 다음 페이지가 있을 수 있는 API용 보정.
 * (ex. 서버가 일부만 먼저 보내는 경우)
 */
export function applyOptimisticFirstPage(
  hasNext,
  { page, optimisticTried = false, contentLen, pageSize },
) {
  if (!hasNext && page === 0 && !optimisticTried && contentLen > 0 && contentLen < pageSize) {
    return { hasNext: true, optimisticTried: true }
  }
  return { hasNext, optimisticTried }
}

/**
 * 연속 빈 응답(=더 없음) 처리. threshold(기본 1)회 연속으로 비면 hasNext=false.
 */
export function applyEmptyHitsGuard(hasNext, { emptyHits = 0, threshold = 1 }) {
  if (emptyHits >= threshold) return false
  return hasNext
}

/**
 * 페이징 응답을 받아 상태를 한 번에 갱신할 때 쓰는 헬퍼.
 */
export function resolvePaginationState({
  data,
  page,
  pageSize,
  optimisticTried = false,
  emptyHits = 0,
}) {
  const content = extractContent(data)
  const contentLen = content.length

  // 빈 응답 카운터 갱신
  emptyHits = contentLen === 0 ? emptyHits + 1 : 0

  // 기본 hasNext 계산
  let hasNext = computeHasNext(data, contentLen, pageSize)

  // 1페이지 보정(낙관 페이징)
  const opt = applyOptimisticFirstPage(hasNext, {
    page,
    optimisticTried,
    contentLen,
    pageSize,
  })
  hasNext = opt.hasNext
  optimisticTried = opt.optimisticTried

  // 연속 빈 응답 가드
  hasNext = applyEmptyHitsGuard(hasNext, { emptyHits, threshold: 1 })

  const nextPage = hasNext ? page + 1 : page

  return { content, hasNext, nextPage, optimisticTried, emptyHits }
}

export default {
  extractContent,
  computeHasNext,
  applyOptimisticFirstPage,
  applyEmptyHitsGuard,
  resolvePaginationState,
}
