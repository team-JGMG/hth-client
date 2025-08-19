<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserFundingOrders, getUserShares, refundFundingOrder } from '@/api/funding'
import { getAllocations, unwrapAllocations } from '@/api/allocation'
import NoInvestmentItems from './NoInvestmentItems.vue'
import CancelConfirmModal from '@/components/account/CancelConfirmModal.vue'
import DividendModal from './InvestmentTab/DividendModal.vue'
import FundingItemCard from './InvestmentTab/FundingItemCard.vue'
import OwnedItemCard from './InvestmentTab/OwnedItemCard.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/common/Spinner/LoadingSpinner.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

import { useInfiniteList } from '@/components/account/utils/useInfiniteList.js'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const toImg = (src) =>
  !src ? '/default-img.png' : /^https?:\/\//i.test(src) ? src : `https://half-to-half.site${src}`
const PAGE_SIZE = 4

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const auth = useAuthStore()
const { userId: storeUserId } = storeToRefs(auth)
const userId = computed(() => storeUserId.value ?? 3)

const initialLoading = ref(true)

const isModalOpen = ref(false)
const isCancelLoading = ref(false)
const selectedOrder = ref(null)

const isDividendModalOpen = ref(false)
const isDividendLoading = ref(false)
const selectedBuildingName = ref('')
const selectedDividends = ref([])

const formatPlusAmount = (n) => `+ ${Number(n ?? 0).toLocaleString('ko-KR')}`
const formatDateMd = (d) => {
  if (!d) return ''
  const date = new Date(d)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

const fundingList = useInfiniteList({
  pageSize: PAGE_SIZE,
  rootMargin: '0px 0px 400px 0px',
  fetch: async ({ page, pageSize }) => {
    const res = await getUserFundingOrders('all', page, pageSize)
    await delay(10)
    return res?.data?.data ?? res?.data ?? {}
  },
  map: (item) => {
    const raw = String(item.status ?? item.orderStatus ?? '')
      .trim()
      .toUpperCase()
    const normalized = raw === 'REFUNDED' ? 'refunded' : 'pending'
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
  },
})

const sharesList = useInfiniteList({
  pageSize: PAGE_SIZE,
  rootMargin: '0px 0px 400px 0px',
  fetch: async ({ page, pageSize }) => {
    const res = await getUserShares(page, pageSize)
    await delay(10)
    return res?.data?.data ?? res?.data ?? {}
  },
  map: (item) => ({
    fundingId: item.fundingId ?? item?.funding?.id,
    name: item.propertyTitle ?? item.title ?? '',
    ownedAmount: Number(item.shareCount ?? 0),
    avgPrice: Number(item.averageAmount ?? 0),
    price: Number(item.currentShareAmount ?? item.currentAmount ?? 0),
    img: toImg(item.thumbnailUrl ?? item?.thumbnail?.photoUrl),
    status: '보유 중',
  }),
})

const fundingItems = fundingList.items
const ownedItems = sharesList.items

function goFundingDetail(id) {
  const hasId =
    (typeof id === 'number' && !Number.isNaN(id)) || (typeof id === 'string' && id.trim() !== '')

  const path = hasId ? `/funding/detail/${id}` : '/funding/detail'
  router.push(path)
}

const openCancelModal = (item) => {
  const payload = {
    fundingId: item.fundingId,
    orderId: item.orderId,
    orderPrice: Number(item.orderPrice),
  }
  if (!payload.fundingId || !payload.orderId || !payload.orderPrice) {
    toast.error({ title: '환불 실패', body: '환불에 필요한 주문 정보가 없습니다.' })
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
      toast.success({ title: '주문 취소 완료', body: '주문이 취소(환불)되었습니다.' })
    } else {
      toast.warn({ title: '요청 오류', body: res?.data?.message || '환불 처리에 실패했습니다.' })
    }
  } catch {
    toast.error({ title: '환불 실패', body: '환불 처리 중 오류가 발생했습니다.' })
  } finally {
    isCancelLoading.value = false
    closeModal()
  }
}

const openDividendModal = async (item) => {
  try {
    isDividendLoading.value = true
    selectedBuildingName.value = item.name
    selectedDividends.value = []
    const res = await getAllocations(item.fundingId)
    const list = unwrapAllocations(res)
    selectedDividends.value = list.map((a) => ({
      date: a.paymentDate ?? a.payment_date,
      perShare: a.dividendPerShare ?? a.dividend_per_share,
      total: a.totalDividendAmount ?? a.total_dividend_amount,
      status: a.paymentStatusKorean ?? a.paymentStatus ?? a.payment_status,
    }))
    isDividendModalOpen.value = true
  } catch {
    toast.show('배당금 내역을 가져오지 못했습니다.')
  } finally {
    isDividendLoading.value = false
  }
}

async function resetAndReload() {
  fundingList.reset()
  sharesList.reset()

  initialLoading.value = true
  await Promise.allSettled([fundingList.fetchNext(), sharesList.fetchNext()])
  initialLoading.value = false

  await nextTick()
  fundingList.setupObserver()
  sharesList.setupObserver()
  fundingList.kickstartIfVisible()
  sharesList.kickstartIfVisible()
}
onMounted(resetAndReload)
watch(() => route.query.r, resetAndReload)
watch(userId, (id, prev) => {
  if (id && id !== prev) resetAndReload()
})

onBeforeUnmount(() => {
  fundingList.teardownObserver()
  sharesList.teardownObserver()
})

const groupedDividends = computed(() => {
  const list = (selectedDividends.value || [])
    .map((a) => ({
      year: new Date(a.date).getFullYear(),
      date: a.date,
      dateMd: formatDateMd(a.date),
      amount: formatPlusAmount(a.perShare ?? a.dividendPerShare),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const map = new Map()
  for (const it of list) {
    if (!map.has(it.year)) map.set(it.year, [])
    map.get(it.year).push({ dateMd: it.dateMd, amount: it.amount })
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }))
})

const showFundingListSpinner = computed(
  () => !fundingItems.value.length && fundingList.isLoading.value && !initialLoading.value,
)
const showSharesListSpinner = computed(
  () => !ownedItems.value.length && sharesList.isLoading.value && !initialLoading.value,
)

const setFundingBottomRef = (el) => (fundingList.bottomRef.value = el)
const setSharesBottomRef = (el) => (sharesList.bottomRef.value = el)
</script>

<template>
  <div class="min-h-[600px]">
    <div v-if="initialLoading" class="flex justify-center items-center py-16">
      <LoadingSpinner />
    </div>

    <NoInvestmentItems v-else-if="!fundingItems.length && !ownedItems.length" />

    <div v-else-if="fundingItems.length" class="space-y-4 mb-6 relative pb-8">
      <BaseTypography class="text-lg !font-bold mb-2">펀딩 중인 매물</BaseTypography>

      <template v-if="showFundingListSpinner">
        <div class="flex justify-center py-8"><LoadingSpinner /></div>
      </template>

      <FundingItemCard
        v-for="(item, idx) in fundingItems"
        :key="`${item.orderId}-${idx}`"
        :item="item"
        :is-cancel-loading="isCancelLoading && selectedOrder?.orderId === item.orderId"
        @click="goFundingDetail(item.fundingId)"
        @cancel="openCancelModal(item)"
      />

      <div :ref="setFundingBottomRef" class="h-[1px] w-full opacity-0 pointer-events-none" />

      <div
        v-if="fundingList.isLoading.value && fundingItems.length"
        class="absolute left-0 right-0 bottom-25 flex justify-center pointer-events-none"
      >
        <LoadingSpinner />
      </div>
    </div>

    <div class="py-10"></div>

    <div class="space-y-4 mb-6 relative pb-8" v-if="ownedItems.length">
      <BaseTypography class="text-lg !font-bold mb-2">보유중인 매물</BaseTypography>

      <template v-if="showSharesListSpinner">
        <div class="flex justify-center py-8"><LoadingSpinner /></div>
      </template>

      <OwnedItemCard
        v-for="(item, idx) in ownedItems"
        :key="`${item.fundingId}-${idx}`"
        :item="item"
        @click="goFundingDetail(item.fundingId)"
        @open-dividend="openDividendModal(item)"
      />

      <div :ref="setSharesBottomRef" class="h-[1px] w-full opacity-0 pointer-events-none" />

      <div
        v-if="sharesList.isLoading.value && ownedItems.length"
        class="absolute left-0 right-0 -bottom-5 flex justify-center pointer-events-none"
      >
        <LoadingSpinner />
      </div>
    </div>
  </div>

  <DividendModal
    :is-open="isDividendModalOpen"
    :loading="isDividendLoading"
    :building-name="selectedBuildingName"
    :groups="groupedDividends"
    @close="isDividendModalOpen = false"
  />

  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>

<style scoped></style>
