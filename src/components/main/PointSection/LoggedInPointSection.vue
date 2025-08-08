<template>
  <div class="relative mb-4">
    <div>
      <BaseTypography class="text-xl mb-1" color="white">
        {{ authStore.userInfo?.name ? `${authStore.userInfo.name}님,` : '???님,' }}
      </BaseTypography>

      <div class="absolute top-0 right-0">
        <slot></slot>
      </div>

      <div class="mb-4 flex items-baseline justify-between">
        <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
        <BaseTypography class="text-xl font-medium" color="white">
          {{ (authStore.userInfo?.point || 0).toLocaleString() }}원
        </BaseTypography>
      </div>
    </div>

    <div class="flex space-x-3 mb-3">
      <button
        class="flex-1 bg-green-400 text-black py-2 rounded-xl font-medium"
        @click="isChargeModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">add</span>
        <br />
        <BaseTypography class="font-bold">포인트 충전</BaseTypography>
      </button>
      <button
        class="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-medium"
        @click="isRefundModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">remove</span><br />
        <BaseTypography class="font-bold">포인트 환급</BaseTypography>
      </button>
    </div>

    <BaseCard class="h-6 flex justify-between items-center px-6">
      <BaseTypography class="font-medium">포인트 관리하러 가기</BaseTypography>
      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="myPage"
        aria-label="투자매물 탐색하기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>

    <!-- 충전 모달 -->
    <BaseModal
      :isOpen="isChargeModalOpen"
      @close="isChargeModalOpen = false"
      @submit="() => requestPay(chargeAmount)"
    >
      <PointChargeModal v-model="chargeAmount" />
      <template #submit>
        <BaseTypography color="white"> 충전하기 </BaseTypography>
      </template>
    </BaseModal>

    <!-- 환급 모달 -->
    <BaseModal
      :isOpen="isRefundModalOpen"
      @close="isRefundModalOpen = false"
      @submit="handleRefund"
    >
      <PointRefundModal v-model="refundAmount" />
      <template #submit>
        <BaseTypography color="white"> 환급 신청하기 </BaseTypography>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import PointChargeModal from './PointModal/PointChargeModel.vue'
import PointRefundModal from './PointModal/PointRefundModal.vue'
import { useAuthStore } from '@/stores/authStore'
import { requestChargeMerchantUid, verifyPayment } from '@/api/point'
import { storeToRefs } from 'pinia'
import { getPointBalance } from '@/api/point'
import { requestPointRefund } from '@/api/point'

const router = useRouter()
const authStore = useAuthStore()
const { getIsLoggedIn } = storeToRefs(authStore)

const isChargeModalOpen = ref(false)
const isRefundModalOpen = ref(false)
const chargeAmount = ref(0)

const refundAmount = ref(0)

const myPage = () => {
  router.push('/account/my-page')
}

onMounted(async () => {
  try {
    const point = await getPointBalance()
    authStore.userInfo = {
      ...authStore.userInfo,
      point,
    }
  } catch (e) {
    console.error('포인트 불러오기 실패:', e)
  }
})

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) {
    alert('로그인이 필요합니다.')
    return
  }

  if (!amount || amount <= 0) {
    alert('충전할 금액을 입력해주세요.')
    return
  }

  try {
    const merchant_uid = await requestChargeMerchantUid(amount)

    const { IMP } = window
    if (!IMP) {
      alert('PortOne 스크립트가 로드되지 않았습니다.')
      return
    }

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
            const verifyResult = await verifyPayment({
              impUid: rsp.imp_uid,
              amount,
            })

            alert('서버 검증 성공: ' + JSON.stringify(verifyResult))
            isChargeModalOpen.value = false
            chargeAmount.value = 0

            // 포인트 정보 다시 불러오기
            // await authStore.loadUserInfo()
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

// 환급 처리 로직
const handleRefund = async () => {
  try {
    await requestPointRefund({
      refundAmount: refundAmount.value,
    })

    alert('환급 신청이 완료되었습니다.')
    isRefundModalOpen.value = false

    const point = await getPointBalance()
    authStore.userInfo = {
      ...authStore.userInfo,
      point,
    }
  } catch (err) {
    alert('❌ 환급 실패: ' + (err.response?.data?.message || err.message))
  }
}
</script>
