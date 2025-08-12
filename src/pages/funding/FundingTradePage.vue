<template>
  <BlankLayout>
    <div class="flex-1 overflow-y-auto pb-36">
      <!-- 헤더 -->
      <DetailHeader>
        <BaseTypography tag="h2" size="2xl" weight="semibold" class="text-2xl">
          {{ item.title || '매물 제목 없음' }}
        </BaseTypography>
      </DetailHeader>

      <!-- 주당 가격 -->
      <div class="flex justify-between items-center text-sm text-black font-medium mb-4">
        <BaseTypography size="sm" weight="medium" class="px-2">주당 가격</BaseTypography>
        <BaseTypography weight="bold" class="px-2">
          {{ item.shareAmount.toLocaleString() }}원/주
        </BaseTypography>
      </div>

      <!-- + 버튼들 -->
      <div class="flex justify-between gap-2 mb-4">
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-1 text-sm md:text-sm leading-none border-2 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(1)"
          >+1주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-1 text-sm md:text-sm leading-none border-2 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(10)"
          >+10주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-1 text-sm md:text-sm leading-none border-2 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(50)"
          >+50주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-1 text-sm md:text-sm leading-none border-2 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(100)"
          >+100주</BaseButton
        >
      </div>

      <!-- 수량 입력 필드 -->
      <div class="relative mb-3">
        <input
          type="number"
          v-model.number="quantity"
          min="0"
          placeholder="구매할 수량(주)을 입력해주세요."
          class="w-full h-10 border-2 border-gray-200 rounded-[10px] px-8 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
      </div>

      <!-- 총 가격 -->
      <div class="w-full h-10 bg-gray-200 rounded-[10px] px-4 flex items-center mb-6">
        <BaseTypography size="sm" class="font-semibold">
          ₩ {{ totalPrice.toLocaleString() }}
        </BaseTypography>
      </div>

      <!-- 투자 가능 현황 카드 -->
      <div class="bg-gray-50 rounded-xl border border-gray-300 p-4">
        <BaseTypography size="sm" class="mb-3 !font-semibold text-xl"
          >투자 가능 현황</BaseTypography
        >

        <!-- 현재 보유 주 -->
        <div class="flex justify-between text-sm mb-2">
          <BaseTypography size="sm" class="font-semibold">현재 보유 주</BaseTypography>
          <BaseTypography size="sm" weight="medium" class="text-right">
            {{ item.userShareCount }}주 ({{
              (item.userShareCount * item.shareAmount).toLocaleString()
            }}원)
          </BaseTypography>
        </div>

        <!-- 보유 포인트 -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-2">
            <img :src="moneyIcon" alt="money icon" class="w-5 h-5" />
            <BaseTypography class="text-xl !font-bold">보유 포인트</BaseTypography>
          </div>

          <div class="text-right">
            <div class="flex items-center space-x-2 justify-end">
              <BaseTypography class="text-xl font-bold">
                {{ Number(item.userPoints ?? 0).toLocaleString() }}원
              </BaseTypography>
              <BaseButton
                variant="secondary"
                class="px-2 py-1 rounded-[10px] text-white hover:bg-gray-700 text-sm cursor-pointer"
                @click="handleCharge"
              >
                <BaseTypography size="sm" class="!text-white">충전하기</BaseTypography>
              </BaseButton>
            </div>

            <!-- 수량 및 금액 변화 표시 -->
            <div class="flex justify-between items-center gap-4 text-sm mt-2 font-bold">
              <BaseTypography class="!text-blue-600">+{{ quantity || 0 }}주</BaseTypography>
              <BaseTypography class="!text-red-500"
                >-{{ totalPrice.toLocaleString() }}원</BaseTypography
              >
            </div>
          </div>
        </div>

        <!-- 예측 정보 -->
        <div class="border-t pt-3 mt-3 text-base">
          <div class="flex justify-between mb-2">
            <BaseTypography size="base" weight="medium" class="!text-gray-600"
              >예상 잔여 포인트</BaseTypography
            >
            <BaseTypography class="!font-bold">
              {{ Math.max(0, Number(item.userPoints ?? 0) - totalPrice).toLocaleString() }}원
            </BaseTypography>
          </div>
          <div class="flex justify-between">
            <BaseTypography size="base" weight="medium" class="!text-gray-600"
              >예상 총 보유 주</BaseTypography
            >
            <BaseTypography class="!font-bold">
              {{ item.userShareCount + Number(quantity) }}주 ({{
                ((item.userShareCount + Number(quantity)) * item.shareAmount).toLocaleString()
              }}원)
            </BaseTypography>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 고정 버튼 바 -->
    <div class="fixed inset-x-0 bottom-[72px] z-40 border-t border-gray-200 bg-white">
      <div class="max-w-md mx-auto px-6">
        <div class="flex flex-col w-full">
          <BaseButton
            class="w-full bg-white border-gray-300 text-gray-800 text-sm font-medium rounded-[10px] flex items-center justify-center gap-1 hover:bg-white"
            @click="handleReset"
          >
            <img src="@/assets/images/refresh.png" alt="초기화" class="w-4 h-4 cursor-pointer" />
            <BaseTypography class="cursor-pointer">초기화</BaseTypography>
          </BaseButton>

          <BaseButton
            class="w-full py-3 !bg-black text-white text-m rounded-[10px] hover:bg-gray-900 flex justify-center items-center text-center cursor-pointer"
            @click="handleFunding"
          >
            펀딩하기
          </BaseButton>
        </div>
      </div>
    </div>
  </BlankLayout>

  <!-- 확인 모달 -->
  <BaseModal :isOpen="showConfirmModal" @close="showConfirmModal = false">
    <template #default>
      <div class="p-4 pb-0">
        <BaseTypography class="mb-4" size="xl" weight="bold"
          >선택하신 수량으로 펀딩을 진행하시겠습니까?</BaseTypography
        >
        <BaseTypography size="base" color="gray-1" class="text-start mb-0">
          <br />주당 가격: {{ item.shareAmount.toLocaleString() }}원/주 <br />구매 수량:
          {{ quantity }}주 <br />총 펀딩금액: {{ totalPrice.toLocaleString() }}원 <br />예상 잔여
          포인트: {{ (Number(item.userPoints ?? 0) - totalPrice).toLocaleString() }}원
        </BaseTypography>
      </div>
    </template>
    <template #submit>
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleFinalSubmit"
      >
        펀딩하기
      </CompletedButton>
    </template>
  </BaseModal>

  <!-- 완료 모달 -->
  <CompletedModal
    :isOpen="showCompleteModal"
    @close="showCompleteModal = false"
    @submit="goToMyPage"
  >
    펀딩이 완료되었습니다.
    <template #submitText>닫기</template>
  </CompletedModal>

  <!-- 충전 모달 -->
  <BaseModal
    :isOpen="isChargeModalOpen"
    @close="isChargeModalOpen = false"
    @submit="onChargeSubmit"
  >
    <PointChargeModal v-model="chargeAmount" />
    <template #submit><BaseTypography color="white">충전하기</BaseTypography></template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { getFundingOrderLimit, createFundingOrder } from '@/api/fundingtrade'
import { getFundingById } from '@/api/funding'
import { requestChargeMerchantUid, verifyPayment, getPointBalance } from '@/api/point'

import BaseModal from '@/components/common/Modal/BaseModal.vue'
import CompletedModal from '@/components/common/Modal/CompletedModal.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import PointChargeModal from '@/components/main/PointSection/PointModal/PointChargeModal.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'

// 응답 로깅 헬퍼
function logLimit(tag, limit) {
  // 혹시 문자열 숫자로 올 수도 있으니 Number(...)로 정규화
  const row = {
    fundingId,
    userId: Number(userId.value),
    remainingAmount: Number(limit?.remainingAmount),
    remainingShares: Number(limit?.remainingShares),
    shareAmount: Number(limit?.shareAmount),
    userPoints: Number(limit?.userPoints),
    userShareCount: Number(limit?.userShareCount),
  }
  console.group(`[LIMIT][${tag}]`)
  console.log('raw:', limit)
  console.table([row])
  console.groupEnd()
}

const showConfirmModal = ref(false)
const showCompleteModal = ref(false)
const isChargeModalOpen = ref(false)
const chargeAmount = ref(0)

const route = useRoute()
const router = useRouter()
const fundingId = Number(route.params.id)

const authStore = useAuthStore()
const { getIsLoggedIn, userId } = storeToRefs(authStore)

const item = ref({
  title: '로딩 중...',
  shareAmount: 5000,
  userPoints: 0,
  userShareCount: 0,
  remainingAmount: 0,
  remainingShares: 0,
})

const quantity = ref(0)

const totalPrice = computed(() => Number(quantity.value || 0) * Number(item.value.shareAmount))

const addShares = (n) => {
  quantity.value = Number(quantity.value || 0) + n
}
const handleReset = () => {
  quantity.value = 0
}
const handleCharge = () => {
  isChargeModalOpen.value = true
}
const moneyIcon = new URL('@/assets/images/moneyIcon.png', import.meta.url).href

const handleFunding = () => {
  if (!isStepValid.value) return alert('구매할 수량을 입력해주세요.')
  if (totalPrice.value > Number(item.value.userPoints || 0)) {
    alert('포인트가 부족합니다. 충전 후 이용해주세요.')
    return
  }
  showConfirmModal.value = true
}

const handleFinalSubmit = async () => {
  try {
    const payload = {
      fundingId,
      userId: userId.value,
      shareCount: Number(quantity.value),
    }
    console.log('[REQ] funding-order', payload)

    const res = await createFundingOrder(payload) // ← 이제 { ok, message, data }
    console.log('[RES] funding-order (normalized)', res)

    if (res.ok) {
      showConfirmModal.value = false
      showCompleteModal.value = true
      await refreshPointBalance()
      // 필요하면 수량 리셋
      // quantity.value = 0
    } else {
      alert(`펀딩 실패: ${res.message || '알 수 없는 오류'}`)
      showConfirmModal.value = false
    }
  } catch (err) {
    console.error('펀딩 오류:', err?.response?.data || err)
    alert(err?.response?.data?.message || '펀딩 처리 중 오류가 발생했습니다.')
    showConfirmModal.value = false
  }
}

const goToMyPage = () => router.push('/account/my-page')
const isStepValid = computed(() => Number(quantity.value) > 0)

const refreshPointBalance = async () => {
  try {
    const raw = await getPointBalance(userId.value)
    // 숫자만 유지
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
  } catch (e) {
    console.error('포인트 갱신 실패:', e)
  }
}

const onChargeSubmit = async () => {
  await nextTick() // 자식 → 부모 v-model 전파 보장
  const amt = Number(chargeAmount.value)
  if (!Number.isFinite(amt) || amt <= 0) {
    alert('충전할 금액을 입력해주세요.')
    return
  }
  await requestPay(amt)
}

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) return alert('로그인이 필요합니다.')
  const amt = Number(amount)
  if (!Number.isFinite(amt) || amt <= 0) return alert('충전할 금액을 입력해주세요.')

  try {
    const merchant_uid = await requestChargeMerchantUid(amt)
    if (!merchant_uid) return alert('결제 식별자(merchant_uid) 발급 실패')

    const { IMP } = window
    if (!IMP) return alert('PortOne 스크립트가 로드되지 않았습니다.')
    if (!import.meta.env.VITE_PORTONE_IMP_KEY)
      return alert('포트원 키가 설정되지 않았습니다. VITE_PORTONE_IMP_KEY 확인')

    IMP.init(import.meta.env.VITE_PORTONE_IMP_KEY)
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        name: '반의 반 집 포인트 충전',
        amount: amt,
        merchant_uid,
        buyer_email: authStore.userInfo?.email || 'guest@example.com',
        buyer_name: authStore.userInfo?.name || '비회원',
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

onMounted(async () => {
  if (!getIsLoggedIn.value) {
    alert('로그인이 필요합니다.')
    router.push('/auth/login')
    return
  }
  try {
    const [limit, detailRes] = await Promise.all([
      getFundingOrderLimit(fundingId, userId.value),
      getFundingById(fundingId),
    ])
    logLimit('MOUNT', limit)
    const detail = detailRes?.data?.data ?? {}

    // 주당가 안전 세팅 (currentShareAmount > shareAmount > limit.shareAmount > 5000)
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
  } catch (error) {
    console.error('펀딩 정보를 가져오는 데 실패했습니다:', error)
    alert('펀딩 정보를 가져오는 데 실패했습니다.')
  }
})

const loaded = ref(false) // 로딩 여부 표시(선택)

watch(
  userId,
  async (v) => {
    const uid = Number(v)
    if (!Number.isInteger(uid)) return

    try {
      loaded.value = false

      const [limit, detailRes] = await Promise.all([
        getFundingOrderLimit(fundingId, uid), // ← 언래핑된 객체가 들어옴
        getFundingById(fundingId),
      ])
      const detail = detailRes?.data?.data ?? {}

      // 주당가 안전 세팅
      const share =
        Number(detail.currentShareAmount) ||
        Number(detail.shareAmount) ||
        Number(limit?.shareAmount) ||
        5000

      // limit 에 userPoints, userShareCount 등 들어오면 바로 1차 반영
      item.value = {
        ...item.value,
        ...limit,
        title: detail.title || `펀딩 매물 #${fundingId}`,
        shareAmount: share,
      }

      // 그리고 '진짜 잔액'으로 최종 오버라이드
      await refreshPointBalance()
    } catch (e) {
      console.error('초기화 실패:', e)
      alert('펀딩 정보를 가져오는 데 실패했습니다.')
    } finally {
      loaded.value = true
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Webkit 기반 브라우저용: 검은 화살표 크게 표시 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5-5 5 5H7zm0 4h10l-5 5-5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1 !important;
  cursor: pointer;
}
</style>
