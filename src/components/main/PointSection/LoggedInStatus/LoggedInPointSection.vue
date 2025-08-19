<template>
  <div class="relative mb-0">
    <PointSummarySection
      :userName="authStore.userName"
      :point="authStore.userPoints"
      :loading="isLoading"
    />

    <div class="absolute top-0 right-0">
      <slot></slot>
    </div>

    <PointActionButtons @charge="isChargeModalOpen = true" @refund="isRefundModalOpen = true" />
    <PointManageCard v-if="props.showManageCard" />

    <BaseModal
      :isOpen="isChargeModalOpen"
      @close="isChargeModalOpen = false"
      @submit="handleCharge"
    >
      <PointChargeModal v-model="chargeAmount" />
      <template #submit><BaseTypography color="white"> 충전하기 </BaseTypography></template>
    </BaseModal>

    <BaseModal
      :isOpen="isRefundModalOpen"
      @close="isRefundModalOpen = false"
      @submit="handleRefund"
    >
      <PointRefundModal v-model="refundAmount" />
      <template #submit><BaseTypography color="white"> 환급 신청하기 </BaseTypography></template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { getPointBalance, requestPointRefund } from '@/api/point'
import { usePortone } from '@/hooks/usePortone'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import PointChargeModal from '../PointModal/PointChargeModal.vue'
import PointRefundModal from '../PointModal/PointRefundModal.vue'
import PointSummarySection from './PointSummarySection.vue'
import PointActionButtons from './PointActionButtons.vue'
import PointManageCard from './PointManageCard.vue'

const props = defineProps({
  showManageCard: { type: Boolean, default: true },
})

const authStore = useAuthStore()
const toast = useToastStore()
const { getIsLoggedIn } = storeToRefs(authStore)
const { processPayment } = usePortone()

const isChargeModalOpen = ref(false)
const isRefundModalOpen = ref(false)
const chargeAmount = ref(0)
const refundAmount = ref(0)
const isLoading = ref(false)

const refreshPointBalance = async () => {
  if (!getIsLoggedIn.value || !authStore.userId) {
    return
  }

  isLoading.value = true
  try {
    const point = await getPointBalance()
    authStore.setUserPoint(point)
  } catch {
    toast.error({ title: '포인트 조회 실패', body: '포인트 정보를 불러올 수 없습니다.' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  if (getIsLoggedIn.value) {
    await refreshPointBalance()
  }
})

watch(
  getIsLoggedIn,
  async (loggedIn) => {
    if (loggedIn) {
      await nextTick()
      await refreshPointBalance()
    }
  },
  { immediate: false },
)

const handleCharge = async () => {
  try {
    await processPayment(chargeAmount.value)
    isChargeModalOpen.value = false
    chargeAmount.value = 0
    await refreshPointBalance()
  } catch (error) {
    // 에러는 usePortone 훅 내부에서 토스트 메시지로 처리됩니다.
    // 추가적인 에러 처리가 필요하다면 여기에 작성할 수 있습니다.
    console.error('Payment process failed:', error)
  }
}

const handleRefund = async () => {
  if (!getIsLoggedIn.value) {
    toast.warn({ title: '로그인이 필요합니다', body: '로그인 후 이용해주세요.' })
    return
  }
  if (!refundAmount.value || refundAmount.value <= 0) {
    toast.warn({ title: '금액 확인', body: '환급 금액을 입력해주세요.' })
    return
  }
  try {
    await requestPointRefund({ amount: Number(refundAmount.value) })
    toast.success({ title: '신청 완료', body: '환급 신청이 완료되었습니다.' })
    isRefundModalOpen.value = false
    refundAmount.value = 0
    await refreshPointBalance()
  } catch (err) {
    toast.error({
      title: '환급 실패',
      body: err?.response?.data?.message || err?.message || '환급 처리 중 오류',
    })
  }
}
</script>
