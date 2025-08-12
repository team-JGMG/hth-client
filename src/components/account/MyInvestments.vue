<!-- MyInvestments.vue -->
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserFundingOrders, getUserShares, refundFundingOrder } from '@/api/funding'
import { getAllocations, unwrapAllocations } from '@/api/allocation'
import { formatAmount } from '@/utils/format'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from '@/components/account/CancelConfirmModal.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import NoInvestmentItems from './NoInvestmentItems.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const route = useRoute()

async function resetAndReload() {
  console.log('[MY] resetAndReload start, r=', route.query.r)

  // 목록/커서 전부 초기화
  fundingItems.value = []
  ownedItems.value = []
  fundingCursor.value = 0
  fundingPage.value = 0
  fundingHasNext.value = true
  sharesPage.value = 0
  sharesHasNext.value = true

  initialLoading.value = true
  await Promise.all([fetchFundingPage(), fetchSharesPage()])
  initialLoading.value = false
  await nextTick()
  setupFundingObserver()
  setupSharesObserver()
}

// 초기 진입
onMounted(resetAndReload)

// /account/my-page?r=... 변경될 때마다 새로고침
watch(
  () => route.query.r,
  () => {
    console.log('[MY] route query.r changed -> reload')
    resetAndReload()
  },
)

const router = useRouter()
function goFundingDetail(fundingId) {
  if (fundingId) router.push({ name: 'funding-detail', params: { id: fundingId } })
}

/** ---------- 상태 ---------- **/
const auth = useAuthStore()
const { userId: storeUserId } = storeToRefs(auth)
const userId = computed(() => storeUserId.value ?? 3)

const initialLoading = ref(true)
const fundingItems = ref([]) // 펀딩중/환불된 주문
const ownedItems = ref([]) // 보유 지분

watch(userId, async (id, prev) => {
  if (id && id !== prev) {
    // 초기화
    fundingItems.value = []
    ownedItems.value = []
    fundingCursor.value = 0
    fundingPage.value = 0
    fundingHasNext.value = true
    sharesPage.value = 0
    sharesHasNext.value = true

    initialLoading.value = true
    await Promise.all([fetchFundingPage(), fetchSharesPage()])
    initialLoading.value = false
    await nextTick()
    setupFundingObserver()
    setupSharesObserver()
  }
})

// 환불 모달
const isModalOpen = ref(false)
const isCancelLoading = ref(false)
const selectedOrder = ref(null)

// 배당 모달 (BaseModal 직접 사용)
const isDividendModalOpen = ref(false)
const isDividendLoading = ref(false)
const selectedBuildingName = ref('')
const selectedDividends = ref([])

/** ---------- 유틸 ---------- **/
const PAGE_SIZE = 4
const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const toImg = (src) =>
  !src ? '/default-img.png' : /^https?:\/\//i.test(src) ? src : `https://half-to-half.site${src}`

/** ---------- 배당 모달 ---------- **/
const openDividendModal = async (item) => {
  try {
    isDividendLoading.value = true
    selectedBuildingName.value = item.name
    selectedDividends.value = []

    const res = await getAllocations(item.fundingId)
    const list = unwrapAllocations(res)

    // 원본 → 화면용으로 최소 정규화 (키 혼용 대비)
    selectedDividends.value = list.map((a) => ({
      date: a.paymentDate ?? a.payment_date,
      perShare: a.dividendPerShare ?? a.dividend_per_share,
      total: a.totalDividendAmount ?? a.total_dividend_amount,
      status: a.paymentStatusKorean ?? a.paymentStatus ?? a.payment_status,
    }))

    isDividendModalOpen.value = true
  } catch (e) {
    console.error('배당금 조회 실패', e)
    alert('배당금 내역을 가져오지 못했습니다.')
  } finally {
    isDividendLoading.value = false
  }
}

/** ---------- 환불(취소) ---------- **/
const openCancelModal = (item) => {
  const payload = {
    fundingId: item.fundingId,
    orderId: item.orderId,
    orderPrice: Number(item.orderPrice),
  }
  if (!payload.fundingId || !payload.orderId || !payload.orderPrice) {
    alert('환불에 필요한 주문 정보가 없습니다. (fundingId / orderId / orderPrice)')
    return
  }
  selectedOrder.value = payload
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  selectedOrder.value = null
}
const confirmCancel = async () => {
  try {
    if (!selectedOrder.value) return
    isCancelLoading.value = true
    const { fundingId, orderId, orderPrice } = selectedOrder.value
    const res = await refundFundingOrder(fundingId, orderId, orderPrice)

    if (res?.data?.status === 'success') {
      fundingItems.value = fundingItems.value.filter((x) => x.orderId !== orderId)
      alert('주문이 취소(환불)되었습니다.')
    } else {
      console.warn('환불 응답:', res?.data)
      alert(res?.data?.message || '환불 처리에 실패했습니다.')
    }
  } catch (e) {
    console.error('환불 실패', e)
    alert('환불 처리 중 오류가 발생했습니다.')
  } finally {
    isCancelLoading.value = false
    closeModal()
  }
}

/** ---------- 무한스크롤: 펀딩(주문) ---------- **/
const fundingStatusOrder = ['all']
const fundingCursor = ref(0)
const fundingPage = ref(0)
const fundingHasNext = ref(true)
const fundingIsLoading = ref(false)
const fundingBottomRef = ref(null)
let fundingObserver = null

async function fetchFundingPage() {
  if (fundingIsLoading.value || !fundingHasNext.value) return
  const status = fundingStatusOrder[fundingCursor.value]
  if (!status) return

  fundingIsLoading.value = true
  try {
    const res = await getUserFundingOrders(status, fundingPage.value, PAGE_SIZE)
    await delay(2000)

    const content = res?.data?.data?.content ?? []
    console.log('[ORDERS][RES]', {
      status,
      page: fundingPage.value,
      size: PAGE_SIZE,
      count: content.length,
      hasNext: res?.data?.data?.hasNext,
      first: content[0],
    })
    const mapped = content.map((item) => {
      const sUpper =
        String(item.status ?? item.orderStatus ?? '')
          .trim()
          .toUpperCase() || status.toUpperCase()
      const normalized = sUpper === 'REFUNDED' ? 'refunded' : 'pending'
      return {
        fundingId: item.fundingId,
        orderId: item.orderId,
        orderPrice: Number(item.orderPrice ?? 0),
        name: item.title ?? '',
        percent: Number(item.achievementRate ?? 0),
        left: Number(item.remainingShares ?? item.remainingAmount ?? 0),
        total: Number(item.targetAmount ?? 0),
        img: toImg(item.thumbnail?.photoUrl),
        status: normalized,
        shareCount: Number(item.shareCount ?? 0),
      }
    })
    fundingItems.value.push(...mapped)

    const hasNext = !!res?.data?.data?.hasNext || res?.data?.data?.last === false
    fundingHasNext.value = hasNext

    if (!hasNext) {
      if (fundingCursor.value + 1 < fundingStatusOrder.length) {
        fundingCursor.value += 1
        fundingPage.value = 0
        fundingHasNext.value = true
      }
    } else {
      fundingPage.value += 1
    }
  } catch (e) {
    console.error('❌ 펀딩 목록 불러오기 실패:', e)
  } finally {
    fundingIsLoading.value = false
  }
}
function setupFundingObserver() {
  if (fundingObserver) fundingObserver.disconnect()
  fundingObserver = new IntersectionObserver(
    ([entry]) => entry.isIntersecting && fetchFundingPage(),
    { threshold: 0, rootMargin: '0px 0px 200px 0px' },
  )
  if (fundingBottomRef.value) fundingObserver.observe(fundingBottomRef.value)
}

/** ---------- 무한스크롤: 보유 지분 ---------- **/
const sharesPage = ref(0)
const sharesHasNext = ref(true)
const sharesIsLoading = ref(false)
const sharesBottomRef = ref(null)
let sharesObserver = null

const ensureObserveShares = () => {
  if (!sharesObserver || !sharesBottomRef.value) return
  sharesObserver.unobserve(sharesBottomRef.value)
  sharesObserver.observe(sharesBottomRef.value)
}

async function fetchSharesPage() {
  if (sharesIsLoading.value || !sharesHasNext.value) return
  sharesIsLoading.value = true
  try {
    const res = await getUserShares(sharesPage.value, PAGE_SIZE)
    await delay(600)

    const data = res?.data?.data ?? res?.data
    let content = []

    if (Array.isArray(data?.content)) {
      content = data.content
      const hasNextFromFlag =
        typeof data.hasNext === 'boolean'
          ? data.hasNext
          : typeof data.last === 'boolean'
            ? data.last === false
            : typeof data.totalPages === 'number' && typeof data.number === 'number'
              ? data.number + 1 < data.totalPages
              : null
      sharesHasNext.value =
        hasNextFromFlag !== null ? hasNextFromFlag : content.length === PAGE_SIZE
      if (sharesHasNext.value) sharesPage.value += 1
    } else if (Array.isArray(data?.items)) {
      content = data.items
      sharesHasNext.value =
        typeof data.hasNext === 'boolean'
          ? data.hasNext
          : typeof data.totalPages === 'number' && typeof data.page === 'number'
            ? data.page + 1 < data.totalPages
            : content.length === PAGE_SIZE
      if (sharesHasNext.value) sharesPage.value += 1
    } else if (Array.isArray(data)) {
      content = data
      sharesHasNext.value = content.length === PAGE_SIZE
      if (sharesHasNext.value) sharesPage.value += 1
    } else {
      content = []
      sharesHasNext.value = false
    }

    const mapped = content.map((item) => ({
      fundingId: item.fundingId ?? item.funding?.id,
      name: item.propertyTitle ?? item.title ?? '',
      ownedAmount: Number(item.shareCount ?? 0),
      avgPrice: Number(item.averageAmount ?? 0),
      price: Number(item.currentShareAmount ?? item.currentAmount ?? 0),
      img: toImg(item.thumbnailUrl ?? item.thumbnail?.photoUrl),
      status: '보유 중',
    }))

    ownedItems.value.push(...mapped)

    await nextTick()
    ensureObserveShares()

    const rect = sharesBottomRef.value?.getBoundingClientRect?.()
    if (!sharesIsLoading.value && sharesHasNext.value && rect && rect.top < window.innerHeight) {
      fetchSharesPage()
    }
  } catch (e) {
    console.error('❌ 보유 지분 불러오기 실패:', e)
  } finally {
    sharesIsLoading.value = false
  }
}

function setupSharesObserver() {
  if (sharesObserver) sharesObserver.disconnect()
  sharesObserver = new IntersectionObserver(
    ([entry]) => entry.isIntersecting && fetchSharesPage(),
    { threshold: 0, rootMargin: '0px 0px 200px 0px' },
  )
  if (sharesBottomRef.value) sharesObserver.observe(sharesBottomRef.value)
}

watch(
  () => ownedItems.value.length,
  async () => {
    await nextTick()
    ensureObserveShares()
  },
)

/** ---------- 초기 로딩 & 옵저버 ---------- **/
// onMounted(async () => {
//   initialLoading.value = true
//   await Promise.all([fetchFundingPage(), fetchSharesPage()])
//   initialLoading.value = false

//   await nextTick()
//   setupFundingObserver()
//   setupSharesObserver()
// })

onBeforeUnmount(() => {
  if (fundingObserver) fundingObserver.disconnect()
  if (sharesObserver) sharesObserver.disconnect()
})

const formatPlusAmount = (n) => `+ ${Number(n ?? 0).toLocaleString('ko-KR')}`

// "MM.DD" 포맷
const formatDateMd = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

// ✅ 연도별 그룹화 (지급예정/완료 라벨 제거, 금액은 "+ 1,234,567")
const groupedDividends = computed(() => {
  const list = (selectedDividends.value || [])
    .map((a) => ({
      year: new Date(a.date).getFullYear(),
      date: a.date,
      dateMd: formatDateMd(a.date),
      amount: formatPlusAmount(a.total ?? a.totalDividendAmount),
    }))
    // 최신 날짜가 위로 오도록 정렬
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const map = new Map()
  for (const it of list) {
    if (!map.has(it.year)) map.set(it.year, [])
    map.get(it.year).push({ dateMd: it.dateMd, amount: it.amount })
  }

  // [{ year: 2025, items: [...] }, { year: 2024, items: [...] }, ...]
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }))
})
</script>

<template>
  <div class="p-4 min-h-[600px]">
    <!-- 초기 스피너 -->
    <div v-if="initialLoading" class="flex justify-center items-center py-16">
      <img
        src="@/assets/images/character/loading.png"
        alt="로딩"
        class="w-12 h-12 animate-spin opacity-70"
      />
    </div>

    <NoInvestmentItems v-else-if="!fundingItems.length && !ownedItems.length" />

    <!-- 펀딩 중인 매물 -->
    <div v-else-if="fundingItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">펀딩 중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in fundingItems"
        :key="`${item.orderId}-${idx}`"
        class="flex justify-between bg-white rounded-lg border px-3 py-2 cursor-pointer hover:bg-gray-50"
        @click="goFundingDetail(item.fundingId)"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">{{
              item.name
            }}</BaseTypography>
            <BaseTypography v-if="item.shareCount" class="text-xs !text-gray-500 mt-1">
              보유 수량: {{ item.shareCount }}주
            </BaseTypography>

            <div class="flex items-center mt-1">
              <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-500 transition-all duration-300"
                  :style="{ width: item.percent + '%' }"
                ></div>
              </div>
              <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                {{ item.percent }}%
              </BaseTypography>
            </div>

            <BaseTypography class="text-xs !text-gray-500 mt-1">
              남은 주(금액): {{ Number(item.left).toLocaleString() }} /
              {{ formatAmount(item.total) }}
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full" @click.stop>
          <div class="h-14"></div>
          <BaseButton
            v-if="item.status === 'pending'"
            :disabled="isCancelLoading && selectedOrder?.orderId === item.orderId"
            @click="openCancelModal(item)"
            variant="danger"
            class="text-xs text-white rounded-md px-3 py-2 hover:bg-[#e63232] transition-colors duration-150 whitespace-nowrap"
          >
            <span class="text-xs font-medium">
              {{
                isCancelLoading && selectedOrder?.orderId === item.orderId
                  ? '취소 중...'
                  : '취소하기'
              }}
            </span>
          </BaseButton>

          <BaseButton
            v-else-if="item.status === 'refunded'"
            disabled
            class="text-xs bg-gray-300 text-white rounded-md px-3 py-2 cursor-not-allowed whitespace-nowrap"
          >
            <span class="text-xs font-medium">거래만료</span>
          </BaseButton>
        </div>
      </div>

      <div ref="fundingBottomRef" class="h-2"></div>
      <div v-if="fundingIsLoading" class="flex justify-center py-4">
        <img
          src="@/assets/images/character/loading.png"
          alt="로딩"
          class="w-12 h-12 animate-spin opacity-70"
        />
      </div>
    </div>

    <!-- 보유중인 매물 -->
    <div v-if="ownedItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">보유중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in ownedItems"
        :key="`${item.fundingId}-${idx}`"
        class="flex justify-between bg-white rounded-lg border px-3 py-2 cursor-pointer hover:bg-gray-50"
        @click="goFundingDetail(item.fundingId)"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">{{
              item.name
            }}</BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1"
              >보유 주 수량: {{ item.ownedAmount }}주</BaseTypography
            >
            <BaseTypography class="text-xs !text-gray-400 mt-0.5"
              >평단가: {{ formatAmount(item.avgPrice) }}</BaseTypography
            >
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full" @click.stop>
          <BaseButton
            variant="secondary"
            @click="openDividendModal(item)"
            class="text-xs px-0.5 mb-1 !py-0.5"
          >
            <BaseTypography class="text-[10px] font-medium !text-white">
              배당금 내역</BaseTypography
            >
          </BaseButton>
          <BaseTypography class="text-xs text-gray-500 mb-0.5">현재 시세</BaseTypography>
          <BaseTypography class="text-base font-semibold" style="color: #ff3b3b">
            {{ formatAmount(item.price) }}
          </BaseTypography>
        </div>
      </div>

      <div ref="sharesBottomRef" class="h-2"></div>
      <div v-if="sharesIsLoading" class="flex justify-center py-4">
        <img
          src="@/assets/images/character/loading.png"
          alt="로딩"
          class="w-12 h-12 animate-spin opacity-70"
        />
      </div>
    </div>
  </div>

  <!-- ✅ BaseModal 직접 사용: 배당 모달 -->
  <BaseModal
    :isOpen="isDividendModalOpen"
    @close="isDividendModalOpen = false"
    @submit="isDividendModalOpen = false"
  >
    <div>
      <!-- 제목 -->
      <BaseTypography size="xl" weight="bold" class="mb-6">
        {{ selectedBuildingName }}
      </BaseTypography>

      <!-- 내용 -->
      <div v-if="isDividendLoading" class="py-12 text-center">
        <BaseTypography class="text-sm !text-gray-500">불러오는 중...</BaseTypography>
      </div>

      <div v-else-if="groupedDividends.length" class="space-y-6 max-h-[400px] overflow-y-auto pr-1">
        <div v-for="(group, gIdx) in groupedDividends" :key="gIdx">
          <BaseTypography size="sm" class="mb-2">{{ group.year }}년</BaseTypography>

          <div
            v-for="(row, idx) in group.items"
            :key="idx"
            class="flex items-center justify-between p-4 rounded-md"
            :class="idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
          >
            <BaseTypography size="sm">{{ row.dateMd }}</BaseTypography>
            <BaseTypography size="sm" weight="bold" class="!text-blue-600">
              {{ row.amount }}
            </BaseTypography>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center">
        <BaseTypography class="text-sm !text-gray-500">배당받은 내역이 없습니다.</BaseTypography>
      </div>
    </div>

    <!-- 제출 버튼 슬롯 -->
    <template #submit>
      <BaseTypography class="!text-white font-medium text-base">확인</BaseTypography>
    </template>
  </BaseModal>

  <!-- 환불 확인 모달 -->
  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>

<style scoped>
.animate-spin {
  animation: spin 0.4s linear infinite;
}
</style>
