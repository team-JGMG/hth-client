<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import LoadingSpinner from '../common/Spinner/LoadingSpinner.vue'
import { getPointTransactions } from '@/api/point'
import PointYearSection from './PointInfoTab/PointYearSection.vue'
import { useInfiniteList } from '@/components/account/utils/useInfiniteList.js'

let _pointAllCache = null
let _pointProbeEmitted = false

function toDateFlexible(dt) {
  if (Array.isArray(dt)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = dt
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss)
  }
  if (typeof dt === 'string') return new Date(dt.replace(' ', 'T'))
  return new Date(dt)
}

const isFirstLoad = ref(true)
const loadError = ref(null)

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

const PAGE_SIZE = 5

const { items, isLoading, bottomRef, fetchNext, setupObserver, teardownObserver } = useInfiniteList(
  {
    pageSize: PAGE_SIZE,

    fetch: async ({ page, pageSize }) => {
      try {
        if (_pointAllCache === null) {
          const res = await getPointTransactions({ page, size: pageSize, sort: 'createdAt,DESC' })
          const body = res?.data ?? res

          if (Array.isArray(body?.data)) {
            _pointAllCache = body.data
          } else {
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

        const all = _pointAllCache || []
        const total = all.length
        const start = page * pageSize
        const slice = all.slice(start, start + pageSize)
        const more = start + slice.length < total

        if (!more && !_pointProbeEmitted) {
          _pointProbeEmitted = true
          return {
            content: slice,
            hasNext: true,
            last: false,
            totalElements: total,
            number: page,
            totalPages: Math.ceil(Math.max(1, total) / pageSize),
          }
        }

        return {
          content: slice,
          hasNext: more,
          last: !more,
          totalElements: total,
          number: page,
          totalPages: Math.ceil(Math.max(1, total) / pageSize),
        }
      } catch (e) {
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

onMounted(async () => {
  _pointAllCache = null
  _pointProbeEmitted = false

  await fetchNext()
  setupObserver()
  isFirstLoad.value = false
})
onBeforeUnmount(() => {
  teardownObserver()
  _pointAllCache = null
  _pointProbeEmitted = false
})
</script>

<template>
  <div class="py-4 min-h-[600px]">
    <div v-if="!groupedLogs.length && !isLoading" class="py-10 text-center text-gray-400">
      <BaseTypography class="!text-gray-400">포인트 내역이 없습니다.</BaseTypography>
    </div>

    <template v-else>
      <PointYearSection
        v-for="group in groupedLogs"
        :key="group.year"
        :year="group.year"
        :logs="group.logs"
      />

      <div ref="bottomRef" class="h-2"></div>

      <div v-if="isLoading" class="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
