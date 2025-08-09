<!-- PointInfo.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatDateTime } from '@/utils/format.js'
import { getPointTransactions } from '@/api/point'
// import { useAuthStore } from '@/stores/authStore' // 나중에 활성화

// ===== 사용자 ID (지금은 4로 고정) =====
const FALLBACK_USER_ID = 4
// 나중에 전환 시:
// const authStore = useAuthStore()
// const resolvedUserId = computed(() => authStore.userId ?? FALLBACK_USER_ID)

function toIso(s) {
  return typeof s === 'string' ? s.replace(' ', 'T') : s
}
function formatToMMDD(dateStr) {
  const full = formatDateTime(toIso(dateStr)) // 'YYYY.MM.DD HH:mm'
  const [datePart] = full.split(' ')
  const [, mm, dd] = (datePart || '').split('.')
  return `${String(mm || '00').padStart(2, '0')}.${String(dd || '00').padStart(2, '0')}`
}
function formatToHHMM(dateStr) {
  const [, timePart] = formatDateTime(toIso(dateStr)).split(' ')
  return timePart || ''
}

// 상태
const rawLogs = ref([])
const isLoading = ref(false)
const loadError = ref(null)

// 타입 매핑
const TYPE_TITLE = { DEPOSIT: '포인트 충전', WITHDRAW: '포인트 환급' }
const TYPE_SIGN = { DEPOSIT: +1, WITHDRAW: -1 }

function mapTx(tx) {
  const type = String(tx?.type || '').toUpperCase()
  const sign = TYPE_SIGN[type] ?? 0
  const amt = Math.abs(Number(tx?.amount ?? 0)) || 0
  return {
    id: tx?.pointTransactionId ?? tx?.id ?? `${tx?.createdAt}-${amt}-${type}`,
    date: toIso(tx?.createdAt),
    title: TYPE_TITLE[type] ?? (type || '알 수 없음'),
    desc: '',
    amount: sign * amt, // 양수: 적립, 음수: 차감
  }
}

async function loadPointLogs() {
  isLoading.value = true
  loadError.value = null
  try {
    // 지금은 userId=4로 호출. 나중엔 resolvedUserId.value로 교체
    const list = await getPointTransactions({
      page: 0,
      size: 100,
      sort: 'createdAt,DESC',
      userId: FALLBACK_USER_ID,
      // userId: resolvedUserId.value, // ← 전환 시 이 줄로 교체
    })
    rawLogs.value = list.map(mapTx)
  } catch (e) {
    console.error('❌ 포인트 내역 불러오기 실패:', e)
    loadError.value = e
    rawLogs.value = []
  } finally {
    isLoading.value = false
  }
}
onMounted(loadPointLogs)

// 연도별 그룹(최신순)
const groupedLogs = computed(() => {
  const sorted = [...rawLogs.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const yearMap = new Map()
  sorted.forEach((log) => {
    const y = new Date(log.date).getFullYear()
    if (!yearMap.has(y)) yearMap.set(y, [])
    yearMap.get(y).push(log)
  })
  return [...yearMap.entries()].sort((a, b) => b[0] - a[0]).map(([year, logs]) => ({ year, logs }))
})
</script>

<template>
  <div class="p-4 min-h-[600px] space-y-6">
    <div v-if="isLoading" class="py-10 text-center text-gray-400">불러오는 중…</div>

    <template v-else-if="groupedLogs.length">
      <div v-for="group in groupedLogs" :key="group.year">
        <BaseTypography class="text-sm text-gray-500">{{ group.year }}년</BaseTypography>

        <div
          v-for="(log, idx) in group.logs"
          :key="log.id ?? idx"
          :class="[
            'flex items-center gap-4 rounded-md px-3 h-[72px] overflow-hidden',
            idx % 2 === 0 ? 'bg-gray-100' : 'bg-white',
          ]"
        >
          <!-- 날짜 -->
          <div class="flex flex-col justify-center items-end min-w-[50px] h-full">
            <BaseTypography class="text-gray-500 text-xs text-right">
              {{ formatToMMDD(log.date) }}
            </BaseTypography>
            <BaseTypography class="text-xs text-gray-500 text-right">
              {{ formatToHHMM(log.date) }}
            </BaseTypography>
          </div>

          <!-- 제목 + 세부내용 -->
          <div class="flex-1 flex flex-col justify-center h-full overflow-hidden">
            <div class="h-[20px] overflow-hidden">
              <BaseTypography class="!font-bold text-sm truncate whitespace-nowrap">
                {{ log.title }}
              </BaseTypography>
            </div>
            <div class="h-[18px] overflow-hidden">
              <BaseTypography
                class="text-xs !font-semibold text-gray-600 truncate whitespace-nowrap"
                :title="log.desc || ''"
              >
                {{ log.desc || '\u00A0' }}
              </BaseTypography>
            </div>
          </div>

          <!-- 금액 -->
          <BaseTypography class="text-sm !font-black min-w-[60px] text-right px-2">
            <span :class="log.amount > 0 ? 'text-red-600' : 'text-blue-600'">
              {{ log.amount > 0 ? '+' : '-' }}{{ Math.abs(log.amount).toLocaleString() }}
            </span>
          </BaseTypography>
        </div>
      </div>
    </template>

    <div v-else class="py-10 text-center text-gray-400">
      <BaseTypography class="!text-gray-400"> 포인트 내역이 없습니다. </BaseTypography>
    </div>
  </div>
</template>
