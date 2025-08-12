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
      @submit="() => requestPay(chargeAmount)"
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
import {
  requestChargeMerchantUid,
  verifyPayment,
  getPointBalance,
  requestPointRefund,
} from '@/api/point'
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

const isChargeModalOpen = ref(false)
const isRefundModalOpen = ref(false)
const chargeAmount = ref(0)
const refundAmount = ref(0)
const isLoading = ref(false)

const refreshPointBalance = async () => {
  console.log('🔄 refreshPointBalance 시작')

  if (!getIsLoggedIn.value || !authStore.userId) {
    console.warn('❌ 로그인되지 않았거나 userId가 없습니다')
    return
  }

  isLoading.value = true
  try {
    console.log('🌐 getPointBalance API 호출, userId:', authStore.userId)
    const point = await getPointBalance(authStore.userId)
    console.log('📨 포인트 API 응답:', { point, type: typeof point })

    authStore.setUserPoint(point)
    console.log('✅ 포인트 업데이트 완료, 현재값:', authStore.userPoints)
  } catch (e) {
    console.error('❌ 포인트 갱신 실패:', e)
    toast.error({ title: '포인트 조회 실패', body: '포인트 정보를 불러올 수 없습니다.' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  console.log('컴포넌트 마운트:', {
    isLoggedIn: getIsLoggedIn.value,
    userId: authStore.userId,
    userInfo: authStore.userInfo,
    userPoints: authStore.userPoints,
  })

  await nextTick()

  if (getIsLoggedIn.value) {
    await refreshPointBalance()
  }
})

watch(
  getIsLoggedIn,
  async (loggedIn) => {
    console.log('🔄 로그인 상태 변화:', loggedIn)
    if (loggedIn) {
      await nextTick()
      await refreshPointBalance()
    }
  },
  { immediate: false },
)

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) {
    toast.warn({ title: '로그인이 필요합니다', body: '로그인 후 이용해주세요.' })
    return
  }
  if (!amount || amount <= 0) {
    toast.warn({ title: '금액 확인', body: '충전할 금액을 입력해주세요.' })
    return
  }
  try {
    const merchant_uid = await requestChargeMerchantUid(Number(amount))
    if (!merchant_uid) {
      alert('결제 식별자(merchant_uid) 발급 실패')
      return
    }

    const { IMP } = window
    if (!IMP) return alert('PortOne 스크립트가 로드되지 않았습니다.')
    if (!import.meta.env.VITE_PORTONE_IMP_KEY) {
      return alert('포트원 키가 설정되지 않았습니다. VITE_PORTONE_IMP_KEY 확인')
    }

    IMP.init(import.meta.env.VITE_PORTONE_IMP_KEY)
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        name: '반의 반 집 포인트 충전',
        amount: Number(amount),
        merchant_uid,
        buyer_email: authStore.userInfo?.email || 'guest@example.com',
        buyer_name: authStore.userName || '비회원',
        buyer_tel: '010-0000-0000',
        buyer_addr: '서울특별시',
        buyer_postcode: '00000',
        m_redirect_url: `${window.location.origin}/payment-complete`,
      },
      async (rsp) => {
        if (!rsp?.success) {
          alert('❌ 결제 실패: ' + (rsp?.error_msg || '사용자 취소 또는 오류'))
          return
        }

        try {
          await verifyPayment({
            impUid: rsp.imp_uid,
            amount: rsp.paid_amount,
            merchantUid: merchant_uid,
          })

          toast.success({ title: '충전 완료', body: '포인트 충전이 완료되었습니다.' })
          isChargeModalOpen.value = false
          chargeAmount.value = 0
          await refreshPointBalance()
        } catch (err) {
          console.error(err)
          toast.error({
            title: '검증 실패',
            body: err?.response?.data?.message || err?.message || '서버 검증 실패',
          })
        }
      },
    )
  } catch (err) {
    console.error(err)
    toast.error({
      title: '요청 오류',
      body: err?.response?.data?.message || err?.message || '결제 요청 오류',
    })
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
    await requestPointRefund({ amount: Number(refundAmount.value), userId: authStore.userId })
    toast.success({ title: '신청 완료', body: '환급 신청이 완료되었습니다.' })
    isRefundModalOpen.value = false
    refundAmount.value = 0
    await refreshPointBalance()
  } catch (err) {
    console.error(err)
    toast.error({
      title: '환급 실패',
      body: err?.response?.data?.message || err?.message || '환급 처리 중 오류',
    })
  }
}
</script>
