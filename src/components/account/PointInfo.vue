<!-- PointInfo.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { getPointTransactions } from '@/api/point' // 경로 확인

/* ========= 날짜 유틸 ========= */
function toDateFlexible(dt) {
  if (Array.isArray(dt)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = dt
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss)
  }
  if (typeof dt === 'string') return new Date(dt.replace(' ', 'T'))
  return new Date(dt)
}
const z2 = (n) => String(n).padStart(2, '0')
function formatMMDD(dt) {
  const d = toDateFlexible(dt)
  return `${z2(d.getMonth() + 1)}.${z2(d.getDate())}`
}
function formatHHMM(dt) {
  const d = toDateFlexible(dt)
  return `${z2(d.getHours())}:${z2(d.getMinutes())}`
}

/* ========= 상태 ========= */
const logs = ref([]) // 화면에 누적되는 내역
const isLoading = ref(false)
const loadError = ref(null)
const isFirstLoad = ref(true)

/* 무한스크롤 공통 */
const PAGE_SIZE = 5
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// 서버 페이징 모드
const page = ref(0)
const hasNext = ref(true)

// 배열(비페이징) 모드용 버퍼
const bufferedMode = ref(false) // true면 클라 청크
const bufferAll = ref([]) // 서버에서 한번 받은 전체 배열
const bufferCursor = ref(0) // 다음 슬라이스 시작 인덱스

// Sentinel & Observer
const bottomRef = ref(null)
let observer = null

/* ========= 타입/부호 매핑 ========= */
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
  return {
    id: tx?.pointTransactionId ?? tx?.id,
    date: tx?.createdAt,
    title: TYPE_TITLE[type] ?? type,
    desc: '',
    amount: sign * amt, // + 적립 / - 차감
    _raw: tx,
  }
}

/* ========= 응답 언랩 =========
 * 가능한 형태 모두 대응:
 * 1) 배열 직접 리턴:            res is Array
 * 2) Axios: { data: [] }
 * 3) Axios: { data: { data: [] } }
 * 4) Axios: { data: { data: { content: [], hasNext, last } } } (서버 페이징)
 */
function unwrapServerPaging(res) {
  return Array.isArray(res?.data?.data?.content) ? res.data.data : null
}
function unwrapArrayAny(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data?.data)) return res.data.data
  if (Array.isArray(res?.data)) return res.data
  return null
}

/* ========= 로딩 로직 ========= */
async function fetchLogsPage() {
  if (isLoading.value) return

  // 클라 청크 모드면 다음 청크만 붙여줌
  if (bufferedMode.value) {
    return appendNextChunk()
  }

  if (!hasNext.value) return
  isLoading.value = true
  loadError.value = null
  try {
    const res = await getPointTransactions({
      page: page.value,
      size: PAGE_SIZE,
      sort: 'createdAt,DESC',
    })
    console.log('[PointInfo] raw response:', res) // 🔍 디버깅
    await delay(20)

    const paged = unwrapServerPaging(res)
    if (paged) {
      // ✅ 서버 페이징
      const mapped = paged.content.map(mapTx)
      logs.value.push(...mapped)
      const nextFlag = !!paged.hasNext || paged.last === false
      hasNext.value = nextFlag
      if (nextFlag) page.value += 1
    } else {
      // ✅ 배열 한 번에 → 클라 청크 모드 전환 + 첫 청크 즉시 렌더
      const arr = unwrapArrayAny(res) || []
      console.log('[PointInfo] array mode len:', arr.length) // 🔍 디버깅
      bufferedMode.value = true
      bufferAll.value = arr
      bufferCursor.value = 0

      const firstSlice = bufferAll.value.slice(0, PAGE_SIZE)
      bufferCursor.value = firstSlice.length
      logs.value.push(...firstSlice.map(mapTx))
      // 배열 모드에서는 hasNext는 클라 버퍼 기준
      hasNext.value = bufferCursor.value < bufferAll.value.length
    }
  } catch (e) {
    console.error('❌ 포인트 내역 불러오기 실패:', e)
    loadError.value = e
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

async function appendNextChunk() {
  if (isLoading.value) return
  const total = bufferAll.value.length
  if (bufferCursor.value >= total) return

  isLoading.value = true
  try {
    await delay(20)
    const slice = bufferAll.value.slice(bufferCursor.value, bufferCursor.value + PAGE_SIZE)
    bufferCursor.value += slice.length
    logs.value.push(...slice.map(mapTx))
    hasNext.value = bufferCursor.value < total
  } catch (e) {
    console.error('❌ 포인트 청크 추가 실패:', e)
  } finally {
    isLoading.value = false
    isFirstLoad.value = false
  }
}

/* ========= 옵저버 ========= */
function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || isLoading.value) return
      if (bufferedMode.value) {
        appendNextChunk()
      } else if (hasNext.value) {
        fetchLogsPage()
      }
    },
    { threshold: 1 },
  )
  if (bottomRef.value) observer.observe(bottomRef.value)
}

onMounted(async () => {
  await fetchLogsPage()
  await nextTick()
  setupObserver()
})
onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

/* ========= 연도별 그룹(누적된 logs 기준) ========= */
const groupedLogs = computed(() => {
  const sorted = [...logs.value].sort((a, b) => toDateFlexible(b.date) - toDateFlexible(a.date))
  const map = new Map()
  sorted.forEach((log) => {
    const y = toDateFlexible(log.date).getFullYear()
    if (!map.has(y)) map.set(y, [])
    map.get(y).push(log)
  })
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, logs]) => ({ year, logs }))
})
</script>

<template>
  <div class="p-4 min-h-[600px] space-y-6">
    <!-- 최초 에러 -->
    <div v-if="loadError && isFirstLoad" class="py-10 text-center text-red-500">
      포인트 내역을 불러오지 못했습니다.
    </div>

    <!-- 비어있음 -->
    <div v-else-if="!groupedLogs.length && !isLoading" class="py-10 text-center text-gray-400">
      <BaseTypography class="!text-gray-400">포인트 내역이 없습니다.</BaseTypography>
    </div>

    <!-- 목록 -->
    <template v-else>
      <div v-for="group in groupedLogs" :key="group.year" class="space-y-2">
        <!-- ✅ 년도 구분 -->
        <BaseTypography class="text-sm text-gray-500">{{ group.year }}년</BaseTypography>

        <div
          v-for="(log, idx) in group.logs"
          :key="log.id ?? idx"
          :class="[
            'flex items-center justify-between rounded-md px-3 h-[72px] overflow-hidden',
            idx % 2 === 0 ? 'bg-gray-100' : 'bg-white',
          ]"
        >
          <!-- 날짜 -->
          <div class="flex flex-col items-end min-w-[50px]">
            <BaseTypography class="text-gray-500 text-xs text-right">
              {{ formatMMDD(log.date) }}
            </BaseTypography>
            <BaseTypography class="text-xs text-gray-500 text-right">
              {{ formatHHMM(log.date) }}
            </BaseTypography>
          </div>

          <!-- 제목 -->
          <BaseTypography
            class="!font-bold text-sm truncate whitespace-nowrap flex-1 mx-3 text-left"
          >
            {{ log.title }}
          </BaseTypography>

          <!-- 금액 -->
          <BaseTypography class="text-sm !font-black min-w-[72px] text-right">
            <span :class="log.amount > 0 ? 'text-blue-600' : 'text-red-600'">
              {{ log.amount > 0 ? '+' : '-' }}{{ Math.abs(log.amount).toLocaleString() }}
            </span>
          </BaseTypography>
        </div>
      </div>

      <!-- 📌 무한스크롤 트리거 -->
      <div ref="bottomRef" class="h-2"></div>

      <!-- ✅ 동일 로딩 아이콘(UI 맞춤) -->
      <div v-if="isLoading" class="flex justify-center py-4">
        <img
          src="@/assets/images/character/loading.png"
          alt="로딩 캐릭터"
          class="w-12 h-12 animate-spin opacity-70"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
