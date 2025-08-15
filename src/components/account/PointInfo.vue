<!-- components/account/PointInfo.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import LoadingSpinner from '../common/Spinner/LoadingSpinner.vue'
import { getPointTransactions } from '@/api/point'
import PointYearSection from './PointInfoTab/PointYearSection.vue'
import { useInfiniteList } from '@/components/account/utils/useInfiniteList.js'

/* ================== 로컬 캐시 & 프로브 플래그 ================== */
/** 서버가 배열만 내려주는 경우: 한 번만 가져와 캐시에 저장하고
 *  이후 스크롤은 캐시에서 잘라서 내려줌.
 *  "마지막처럼 보여도 한 번 더 확인"하는 프로브도 지원.
 */
let _pointAllCache = null
let _pointProbeEmitted = false

/* ================== 날짜 유틸 ================== */
function toDateFlexible(dt) {
  if (Array.isArray(dt)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = dt
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss)
  }
  if (typeof dt === 'string') return new Date(dt.replace(' ', 'T'))
  return new Date(dt)
}

/* ================== 상태 ================== */
const isFirstLoad = ref(true)
const loadError = ref(null)

/* ================== 타입/부호 매핑 ================== */
const TYPE_TITLE = {
  DEPOSIT: '포인트 충전',
  WITHDRAW: '포인트 환급',
  REFUND: '주문 환불 적립',
  CANCEL: '주문 취소 적립',
  PAYOUT: '배당 지급',
  ALLOCATION: '배당 배분',
  INVEST: '투자 차감',
  TRADE_SALE: '거래 매도 정산',
}
const TYPE_SIGN = {
  DEPOSIT: +1,
  WITHDRAW: -1,
  REFUND: +1,
  CANCEL: +1,
  PAYOUT: +1,
  ALLOCATION: +1,
  INVEST: -1,
  TRADE_SALE: +1,
}

/* 서버 → UI 매핑 */
function mapTx(tx) {
  const type = String(tx?.type || '').toUpperCase()
  const sign = TYPE_SIGN[type] ?? 0
  const amt = Math.abs(Number(tx?.amount ?? 0)) || 0
  const created =
    tx?.createdAt ?? tx?.created_at ?? tx?.createdDate ?? tx?.timestamp ?? tx?.date ?? null
  return {
    id: tx?.pointTransactionId ?? tx?.id,
    date: created,
    title: TYPE_TITLE[type] ?? type,
    desc: '',
    amount: sign * amt,
    _raw: tx,
  }
}

/* ================== 무한스크롤 (공용 훅 사용) ================== */
const PAGE_SIZE = 5

const { items, isLoading, bottomRef, fetchNext, setupObserver, teardownObserver } = useInfiniteList(
  {
    pageSize: PAGE_SIZE,

    // ✅ 핵심: 공용 훅은 그대로 두고, 여기서만 "배열 캐시 + 클라 페이징 + 1회 프로브" 구현
    fetch: async ({ page, pageSize }) => {
      try {
        // 1) 캐시에 없으면 단 1회만 네트워크 호출해 전체 배열 확보
        if (_pointAllCache === null) {
          const res = await getPointTransactions({ page, size: pageSize, sort: 'createdAt,DESC' })
          const body = res?.data ?? res

          // 백엔드 표준: { status: 'success', data: [...] }
          if (Array.isArray(body?.data)) {
            _pointAllCache = body.data
          } else {
            // 혹시 다른 깊이에 배열이 있으면 탐색
            const findFirstArray = (obj, depth = 0) => {
              if (!obj || typeof obj !== 'object' || depth > 4) return null
              if (Array.isArray(obj)) return obj
              for (const v of Object.values(obj)) if (Array.isArray(v)) return v
              for (const v of Object.values(obj)) {
                const f = findFirstArray(v, depth + 1)
                if (f) return f
              }
              return null
            }
            _pointAllCache = findFirstArray(body) || []
          }
        }

        // 2) 클라이언트 사이드 페이징
        const all = _pointAllCache || []
        const total = all.length
        const start = page * pageSize
        const slice = all.slice(start, start + pageSize)
        const more = start + slice.length < total

        // 3) 마지막처럼 보여도 한 번 더 확인(프로브) — 1회만
        if (!more && !_pointProbeEmitted) {
          _pointProbeEmitted = true
          return {
            content: slice, // 현재 청크
            hasNext: true, // 👉 한 번 더 호출 유도
            last: false,
            totalElements: total,
            number: page,
            totalPages: Math.ceil(Math.max(1, total) / pageSize),
          }
        }

        // 4) 일반 반환 (마지막 확정 혹은 아직 더 있음)
        return {
          content: slice,
          hasNext: more,
          last: !more,
          totalElements: total,
          number: page,
          totalPages: Math.ceil(Math.max(1, total) / pageSize),
        }
      } catch (e) {
        console.error('[PointInfo] fetch error:', e)
        loadError.value = e
        return {
          content: [],
          hasNext: false,
          last: true,
          totalElements: 0,
          number: page,
          totalPages: 1,
        }
      }
    },

    map: (row) => mapTx(row),
  },
)

const logs = items

/* ================== 연도별 그룹 ================== */
const groupedLogs = computed(() => {
  const sorted = [...(logs.value || [])].sort(
    (a, b) => toDateFlexible(b.date) - toDateFlexible(a.date),
  )
  const map = new Map()
  sorted.forEach((log) => {
    const y = toDateFlexible(log.date).getFullYear()
    if (!map.has(y)) map.set(y, [])
    map.get(y).push(log)
  })
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, logs]) => ({ year, logs }))
})

/* ================== 생명주기 ================== */
onMounted(async () => {
  // 페이지 진입 시 캐시/프로브 초기화
  _pointAllCache = null
  _pointProbeEmitted = false

  await fetchNext() // 첫 페이지
  setupObserver() // 이후 무한스크롤
  isFirstLoad.value = false
})
onBeforeUnmount(() => {
  teardownObserver()
  // 페이지 이탈 시 캐시 정리(다음 진입 시 새로 로드)
  _pointAllCache = null
  _pointProbeEmitted = false
})
</script>

<template>
  <div class="p-4 min-h-[600px] space-y-6">
    <!-- 비어있음 -->
    <div v-if="!groupedLogs.length && !isLoading" class="py-10 text-center text-gray-400">
      <BaseTypography class="!text-gray-400">포인트 내역이 없습니다.</BaseTypography>
    </div>

    <!-- 목록 -->
    <template v-else>
      <PointYearSection
        v-for="group in groupedLogs"
        :key="group.year"
        :year="group.year"
        :logs="group.logs"
      />

      <!-- 무한스크롤 트리거 -->
      <div ref="bottomRef" class="h-2"></div>

      <!-- 로딩 -->
      <div v-if="isLoading" class="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
