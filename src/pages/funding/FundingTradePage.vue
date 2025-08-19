<template>
  <BlankLayout>
    <div class="flex-1 overflow-y-auto pb-28">
      <DetailHeader>
        <BaseTypography tag="h2" size="2xl" weight="semibold" class="text-2xl">
          {{ item.title || '매물 제목 없음' }}
        </BaseTypography>
      </DetailHeader>

      <FundingInputSection
        v-model:quantity="quantity"
        :item="item"
        :total-price="totalPrice"
        @charge="handleCharge"
      />

      <InvestmentStatusCard
        :item="item"
        :quantity="quantity"
        :total-price="totalPrice"
        @charge="handleCharge"
      />
    </div>

    <FundingActions
      :is-logged-in="isLoggedIn"
      :is-valid="isStepValid"
      :has-validation-error="validationState.isError"
      @reset="handleReset"
      @funding="handleFunding"
    />
  </BlankLayout>

  <FundingModals
    :show-confirm="showConfirmModal"
    :show-complete="showCompleteModal"
    :show-charge="isChargeModalOpen"
    :item="item"
    :quantity="quantity"
    :total-price="totalPrice"
    :charge-amount="chargeAmount"
    :is-step-valid="isStepValid"
    @close-confirm="showConfirmModal = false"
    @close-complete="showCompleteModal = false"
    @close-charge="isChargeModalOpen = false"
    @final-submit="handleFinalSubmit"
    @go-to-my-page="goToMyPage"
    @charge-submit="onChargeSubmit"
    v-model:charge-amount="chargeAmount"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { getFundingOrderLimit, createFundingOrder } from '@/api/fundingtrade'
import { getFundingById } from '@/api/funding'
import { getPointBalance } from '@/api/point'
import { useToastStore } from '@/stores/toast'
import { usePortone } from '@/hooks/usePortone'

import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

import FundingInputSection from '@/components/funding/fundingTrade/FundingInputSection.vue'
import InvestmentStatusCard from '@/components/funding/fundingTrade/InvestmentStatusCard.vue'
import FundingActions from '@/components/funding/fundingTrade/FundingActions.vue'
import FundingModals from '@/components/funding/fundingTrade/FundingModals.vue'

const showConfirmModal = ref(false)
const showCompleteModal = ref(false)
const isChargeModalOpen = ref(false)
const chargeAmount = ref(0)

const route = useRoute()
const router = useRouter()
const fundingId = Number(route.params.id)

const toast = useToastStore()
const authStore = useAuthStore()
const { getIsLoggedIn, userId } = storeToRefs(authStore)
const { processPayment } = usePortone()

const isLoggedIn = computed(() => authStore.getIsLoggedIn ?? authStore.isLoggedIn)

const item = ref({
  title: '',
  shareAmount: 5000,
  userPoints: 0,
  userShareCount: 0,
  remainingAmount: 0,
  remainingShares: 0,
})

const quantity = ref(0)

const validationState = computed(() => {
  return { isError: false }
})

const totalPrice = computed(() => Number(quantity.value || 0) * Number(item.value.shareAmount))

const handleReset = () => {
  quantity.value = 0
}

const handleCharge = () => {
  isChargeModalOpen.value = true
}

const handleFunding = () => {
  if (!isStepValid.value) {
    toast.show('구매할 수량을 입력해주세요.')
    return
  }

  if (totalPrice.value > Number(item.value.userPoints || 0)) {
    toast.warn('포인트가 부족합니다. 충전 후 이용해주세요.')
    return
  }

  showConfirmModal.value = true
}

const handleFinalSubmit = async () => {
  try {
    const payload = {
      fundingId,
      shareCount: Number(quantity.value),
    }

    const res = await createFundingOrder(payload)

    if (res.ok) {
      showConfirmModal.value = false
      showCompleteModal.value = true
      await refreshPointBalance()
    } else {
      toast.error({
        title: '펀딩 실패',
        body: res.message || '알 수 없는 오류',
      })
      showConfirmModal.value = false
    }
  } catch (err) {
    toast.error({
      title: '펀딩 오류',
      body: err?.response?.data?.message || '펀딩 처리 중 오류가 발생했습니다.',
    })
    showConfirmModal.value = false
  }
}

const goToMyPage = () =>
  router.push({ path: '/account/my-page/investments', query: { r: Date.now().toString() } })

const isStepValid = computed(() => Number(quantity.value) > 0)

const refreshPointBalance = async () => {
  try {
    const raw = await getPointBalance(userId.value)
    const normalize = (v) => {
      if (typeof v === 'number') return v
      if (typeof v === 'string') return Number(v.replaceAll(',', '')) || 0
      if (v && typeof v === 'object') {
        const cand =
          v.balance ??
          v.point ??
          v.points ??
          v.data?.balance ??
          v.data?.point ??
          v.data?.points ??
          v.data
        return typeof cand === 'number' ? cand : Number(cand) || 0
      }
      return 0
    }
    const balance = normalize(raw)
    authStore.setUserPoint(balance)
    item.value.userPoints = balance
  } catch {
    //
  }
}

const onChargeSubmit = async () => {
  try {
    await processPayment(chargeAmount.value)
    isChargeModalOpen.value = false
    chargeAmount.value = 0
    await refreshPointBalance()
  } catch (error) {
    console.error('Payment process failed:', error)
  }
}

watch(
  userId,
  async (v) => {
    const uid = Number(v)
    if (!Number.isInteger(uid)) return

    try {
      const [limit, detailRes] = await Promise.all([
        getFundingOrderLimit(fundingId),
        getFundingById(fundingId),
      ])
      const detail = detailRes?.data?.data ?? {}

      const share =
        Number(detail.currentShareAmount) ||
        Number(detail.shareAmount) ||
        Number(limit?.shareAmount) ||
        5000

      item.value = {
        ...item.value,
        ...limit,
        title: detail.title || `펀딩 매물 #${fundingId}`,
        shareAmount: share,
      }

      await refreshPointBalance()
    } catch {
      toast.error({
        title: '초기화 실패',
        body: '펀딩 정보를 가져오는 데 실패했습니다.',
      })
    }
  },
  { immediate: true },
)
</script>
