/**
 *  - { content: [...] }
 *  - { items:   [...] }
 *  - [ ... ]
 */
export function extractContent(data) {
  if (!data) return []
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data)) return data
  return []
}

/**
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

export function applyOptimisticFirstPage(
  hasNext,
  { page, optimisticTried = false, contentLen, pageSize },
) {
  if (!hasNext && page === 0 && !optimisticTried && contentLen > 0 && contentLen < pageSize) {
    return { hasNext: true, optimisticTried: true }
  }
  return { hasNext, optimisticTried }
}

export function applyEmptyHitsGuard(hasNext, { emptyHits = 0, threshold = 1 }) {
  if (emptyHits >= threshold) return false
  return hasNext
}

export function resolvePaginationState({
  data,
  page,
  pageSize,
  optimisticTried = false,
  emptyHits = 0,
}) {
  const content = extractContent(data)
  const contentLen = content.length

  emptyHits = contentLen === 0 ? emptyHits + 1 : 0

  let hasNext = computeHasNext(data, contentLen, pageSize)

  const opt = applyOptimisticFirstPage(hasNext, {
    page,
    optimisticTried,
    contentLen,
    pageSize,
  })
  hasNext = opt.hasNext
  optimisticTried = opt.optimisticTried

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
