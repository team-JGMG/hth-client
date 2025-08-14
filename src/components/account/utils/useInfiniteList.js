// components/account/utils/useInfiniteList.js
import { ref, computed, nextTick } from 'vue'
import {
  extractContent,
  resolvePaginationState,
} from '@/components/account/utils/PaginationUtils.js'

/**
 * 무한 스크롤 공통 컴포저블
 *
 * @param {Object} opts
 * @param {number}   opts.pageSize            - 페이지 사이즈
 * @param {Function} opts.fetch               - async ({ page, pageSize }) => rawData
 * @param {Function} opts.map                 - (row) => mappedRow
 * @param {string}   [opts.rootMargin]        - 인터섹션 옵저버 margin (기본 '0px 0px 400px 0px')
 * @param {boolean}  [opts.observeOnMount]    - setupObserver 시 바로 observe 할지(기본 true)
 */
export function useInfiniteList(opts) {
  const {
    pageSize,
    fetch: fetcher,
    map,
    rootMargin = '0px 0px 400px 0px',
    observeOnMount = true,
  } = opts

  // 리스트 상태
  const items = ref([])
  const page = ref(0)
  const hasNext = ref(true)
  const isLoading = ref(false)
  const emptyHits = ref(0)
  const optimisticTried = ref(false)

  // 스크롤 옵저버
  const bottomRef = ref(null)
  let observer = null

  function ensureObserve() {
    const el = bottomRef.value
    if (!observer || !el) return
    try {
      observer?.unobserve?.(el)
    } catch (err) {
      console.log(err)
    }
    observer.observe(el)
  }

  /** 내부: 옵저버 설치 */
  function setupObserver() {
    if (observer) observer.disconnect()
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading.value && hasNext.value) fetchNext()
      },
      { root: null, threshold: 0, rootMargin },
    )
    if (observeOnMount) ensureObserve()
  }

  /** 내부: 옵저버 해제 */
  function teardownObserver() {
    if (observer) observer.disconnect()
  }

  /** 외부: 강제로 첫 화면에서 보이면 시작 */
  function kickstartIfVisible() {
    const rect = bottomRef.value?.getBoundingClientRect?.()
    if (rect && rect.top < window.innerHeight && hasNext.value && !isLoading.value) fetchNext()
  }

  /** 데이터 페칭 */
  async function fetchNext() {
    if (isLoading.value || !hasNext.value) return
    isLoading.value = true
    try {
      const raw = await fetcher({ page: page.value, pageSize })
      const data = raw ?? {}

      // 페이지네이션 상태 계산
      const {
        content,
        hasNext: _hasNext,
        nextPage,
        optimisticTried: _optTried,
        emptyHits: _emptyHits,
      } = resolvePaginationState({
        data,
        page: page.value,
        pageSize,
        optimisticTried: optimisticTried.value,
        emptyHits: emptyHits.value,
      })

      // 매핑 후 push
      const mapped = (content || extractContent(data)).map(map)
      if (mapped.length) items.value.push(...mapped)

      // 상태 갱신
      hasNext.value = _hasNext
      page.value = nextPage
      optimisticTried.value = _optTried
      emptyHits.value = _emptyHits
    } finally {
      isLoading.value = false
      await nextTick()
      ensureObserve()
    }
  }

  /** 초기화 */
  function reset() {
    items.value = []
    page.value = 0
    hasNext.value = true
    isLoading.value = false
    emptyHits.value = 0
    optimisticTried.value = false
    teardownObserver()
  }

  /** 길이 변경 시 재관찰을 위해 컴포넌트에서 watch에 넣을 수 있도록 제공 */
  const length = computed(() => items.value.length)

  return {
    // state
    items,
    page,
    hasNext,
    isLoading,
    emptyHits,
    optimisticTried,

    // dom
    bottomRef,

    // helpers
    fetchNext,
    reset,
    setupObserver,
    ensureObserve,
    teardownObserver,
    kickstartIfVisible,

    // for watchers
    length,
  }
}

export default useInfiniteList
