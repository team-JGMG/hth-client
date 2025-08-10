<template>
  <div class="relative mb-4">
    <PointSummarySection
      :userName="authStore.userInfo?.name ?? '???'"
      :point="Number.isFinite(+authStore.userInfo?.point) ? +authStore.userInfo.point : null"
    />

    <div class="absolute top-0 right-0">
      <slot></slot>
    </div>

    <PointActionButtons @charge="isChargeModalOpen = true" @refund="isRefundModalOpen = true" />
    <PointManageCard />

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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
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

const authStore = useAuthStore()
const { getIsLoggedIn } = storeToRefs(authStore)

const isChargeModalOpen = ref(false)
const isRefundModalOpen = ref(false)
const chargeAmount = ref(0)
const refundAmount = ref(0)

onMounted(async () => {
  if (!getIsLoggedIn.value) return
  try {
    const point = await getPointBalance(authStore.userId)
    authStore.setUserPoint(point)
  } catch (e) {
    console.error('포인트 불러오기 실패:', e)
  }
})

const refreshPointBalance = async () => {
  try {
    const point = await getPointBalance(authStore.userId)
    authStore.setUserPoint(point)
  } catch (e) {
    console.error('포인트 갱신 실패:', e)
  }
}

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) return alert('로그인이 필요합니다.')
  if (!amount || amount <= 0) return alert('충전할 금액을 입력해주세요.')

  try {
    // 1) 서버에서 merchant_uid 발급 (DB: PENDING 저장)
    const merchant_uid = await requestChargeMerchantUid(amount)
    if (!merchant_uid) {
      alert('결제 식별자(merchant_uid) 발급 실패')
      return
    }

    // 2) 포트원 결제창 호출
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
        amount,
        merchant_uid, // 서버 발급값과 반드시 동일하게 전달
        buyer_email: authStore.userInfo?.email || 'guest@example.com',
        buyer_name: authStore.userInfo?.name || '비회원',
        buyer_tel: '010-0000-0000',
        buyer_addr: '서울특별시',
        buyer_postcode: '00000',
        m_redirect_url: `${window.location.origin}/payment-complete`, // 모바일 대응
      },
      async (rsp) => {
        if (!rsp?.success) {
          alert('❌ 결제 실패: ' + (rsp?.error_msg || '사용자 취소 또는 오류'))
          return
        }

        // 3) 결제 성공 → 서버 검증 (실제 결제 금액 + imp_uid + merchant_uid 전송)
        try {
          await verifyPayment({
            impUid: rsp.imp_uid,
            amount: rsp.paid_amount, // ✅ 실제 결제 금액
            merchantUid: merchant_uid, // ✅ PENDING 매칭 필수
          })

          alert('포인트 충전이 완료되었습니다.')
          isChargeModalOpen.value = false
          chargeAmount.value = 0
          await refreshPointBalance()
        } catch (err) {
          console.error(err)
          alert('❌ 서버 검증 실패: ' + (err?.response?.data?.message || err?.message))
        }
      },
    )
  } catch (err) {
    console.error(err)
    alert('❌ 결제 요청 오류: ' + (err?.response?.data?.message || err?.message))
  }
}

const handleRefund = async () => {
  if (!getIsLoggedIn.value) return alert('로그인이 필요합니다.')
  if (!refundAmount.value || refundAmount.value <= 0) return alert('환급 금액을 입력해주세요.')

  try {
    await requestPointRefund({ refundAmount: refundAmount.value })
    alert('환급 신청이 완료되었습니다.')
    isRefundModalOpen.value = false
    refundAmount.value = 0
    await refreshPointBalance()
  } catch (err) {
    console.error(err)
    alert('❌ 환급 실패: ' + (err?.response?.data?.message || err?.message))
  }
}
</script>
