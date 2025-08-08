<template>
  <div class="relative mb-4">
    <PointSummarySection
      :userName="authStore.userInfo?.name || '???'"
      :point="authStore.userInfo?.point || 0"
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
  try {
    const point = await getPointBalance()
    authStore.userInfo = { ...authStore.userInfo, point }
  } catch (e) {
    console.error('포인트 불러오기 실패:', e)
  }
})

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) return alert('로그인이 필요합니다.')
  if (!amount || amount <= 0) return alert('충전할 금액을 입력해주세요.')

  try {
    const merchant_uid = await requestChargeMerchantUid(amount)
    const { IMP } = window
    if (!IMP) return alert('PortOne 스크립트가 로드되지 않았습니다.')

    IMP.init('imp18670123')
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        name: '반의 반 집 포인트 충전',
        amount,
        merchant_uid,
        buyer_email: authStore.userInfo?.email || 'guest@example.com',
        buyer_name: authStore.userInfo?.name || '비회원',
        buyer_tel: '010-0000-0000',
        buyer_addr: '서울특별시',
        buyer_postcode: '00000',
        m_redirect_url: `${window.location.origin}/payment-complete`,
      },
      async (rsp) => {
        if (rsp.success) {
          alert('결제 성공, 서버 검증 중...')
          try {
            const verifyResult = await verifyPayment({ impUid: rsp.imp_uid, amount })
            alert('서버 검증 성공: ' + JSON.stringify(verifyResult))
            isChargeModalOpen.value = false
            chargeAmount.value = 0
          } catch (err) {
            alert('❌ 서버 검증 실패: ' + (err.response?.data?.message || err.message))
          }
        } else {
          alert('❌ 결제 실패: ' + rsp.error_msg)
        }
      },
    )
  } catch (err) {
    alert('❌ 오류 발생: ' + (err.response?.data?.message || err.message))
  }
}

const handleRefund = async () => {
  try {
    await requestPointRefund({ refundAmount: refundAmount.value })
    alert('환급 신청이 완료되었습니다.')
    isRefundModalOpen.value = false
    const point = await getPointBalance()
    authStore.userInfo = { ...authStore.userInfo, point }
  } catch (err) {
    alert('❌ 환급 실패: ' + (err.response?.data?.message || err.message))
  }
}
</script>
