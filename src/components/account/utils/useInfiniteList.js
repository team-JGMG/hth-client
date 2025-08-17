import { computed, nextTick, ref } from 'vue'
import {
  extractContent,
  resolvePaginationState,
} from '@/components/account/utils/PaginationUtils.js'

export function useInfiniteList(opts) {
  const {
    pageSize,
    fetch: fetcher,
    map,
    rootMargin = '0px 0px 400px 0px',
    observeOnMount = true,
  } = opts

  const items = ref([])
  const page = ref(0)
  const hasNext = ref(true)
  const isLoading = ref(false)
  const emptyHits = ref(0)
  const optimisticTried = ref(false)

  const bottomRef = ref(null)
  let observer = null

  function ensureObserve() {
    const el = bottomRef.value
    if (!observer || !el) return
    try {
      observer?.unobserve?.(el)
    } catch {
      //
    }
    observer.observe(el)
  }

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

  function teardownObserver() {
    if (observer) observer.disconnect()
  }

  function kickstartIfVisible() {
    const rect = bottomRef.value?.getBoundingClientRect?.()
    if (rect && rect.top < window.innerHeight && hasNext.value && !isLoading.value) fetchNext()
  }

  async function fetchNext() {
    if (isLoading.value || !hasNext.value) return
    isLoading.value = true
    let mapped = []

    try {
      const raw = await fetcher({ page: page.value, pageSize })
      const data = raw ?? {}

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

      const rows = content ?? extractContent(data)
      mapped = Array.isArray(rows) ? rows.map(map).filter(Boolean) : []

      if (mapped.length) items.value.push(...mapped)

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

  function reset() {
    items.value = []
    page.value = 0
    hasNext.value = true
    isLoading.value = false
    emptyHits.value = 0
    optimisticTried.value = false
    teardownObserver()
  }

  const length = computed(() => items.value.length)

  return {
    items,
    page,
    hasNext,
    isLoading,
    emptyHits,
    optimisticTried,
    bottomRef,
    fetchNext,
    reset,
    setupObserver,
    ensureObserve,
    teardownObserver,
    kickstartIfVisible,
    length,
  }
}

export default useInfiniteList
