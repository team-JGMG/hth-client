<template>
  <BlankLayout>
    <div class="flex-1 overflow-y-auto pb-28">
      <!-- 헤더 -->
      <DetailHeader>
        <BaseTypography tag="h2" size="2xl" weight="semibold" class="text-2xl">
          {{ item.title || '매물 제목 없음' }}
        </BaseTypography>
      </DetailHeader>

      <!-- 주당 가격 -->
      <div class="flex justify-between items-center text-sm text-black font-medium mb-4">
        <BaseTypography size="base" weight="medium" class="px-2">주당 가격</BaseTypography>
        <BaseTypography size="base" weight="bold" class="px-2">
          {{ formatNumber(item.shareAmount) }}원/주
        </BaseTypography>
      </div>

      <!-- + 버튼들 -->
      <div class="flex justify-between gap-2 mb-2">
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-2 text-sm md:text-sm !border-gray-300 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(1)"
          >+1주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-2 text-sm md:text-sm !border-gray-300 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(10)"
          >+10주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-2 text-sm md:text-sm !border-gray-300 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(50)"
          >+50주</BaseButton
        >
        <BaseButton
          variant="outline"
          class="flex-1 !px-1 !py-2 text-sm md:text-sm !border-gray-300 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
          @click="addShares(100)"
          >+100주</BaseButton
        >
      </div>

      <!-- 수량 입력 필드 -->
      <div class="relative mb-2">
        <input
          ref="quantityInput"
          type="text"
          v-model="displayQuantity"
          @input="handleQuantityInput"
          @blur="handleQuantityBlur"
          @focus="handleQuantityFocus"
          placeholder="구매할 수량(주)을 입력해주세요."
          :class="[
            'w-full h-12 border rounded-[10px] px-8 text-base text-black placeholder:text-gray-500 focus:outline-none',
            validationState.isError
              ? 'border-red-500 focus:ring-red-500'
              : validationState.isValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:ring-gray-700',
          ]"
        />
        <!-- 유효성 검사 메시지 -->
        <div class="mt-1 min-h-[20px]">
          <BaseTypography
            v-if="validationState.message"
            size="sm"
            :class="[
              validationState.isError
                ? 'text-red-500'
                : validationState.isValid
                  ? 'text-green-600'
                  : 'text-gray-500',
            ]"
          >
            {{ validationState.message }}
          </BaseTypography>
        </div>
      </div>

      <!-- 총 가격 -->
      <div class="w-full h-12 bg-gray-200 rounded-[10px] px-4 flex items-center mb-2">
        <BaseTypography size="base" class="font-semibold">
          ₩ {{ formatNumber(totalPrice) }}
        </BaseTypography>
      </div>

      <!-- 투자 가능 현황 카드 -->
      <div class="bg-gray-50 rounded-xl border border-gray-300 p-4">
        <BaseTypography size="lg" weight="bold" class="mb-3">투자 가능 현황</BaseTypography>

        <!-- 현재 보유 주 -->
        <div class="flex justify-between text-sm mb-2">
          <BaseTypography size="sm" class="font-semibold">현재 보유 주</BaseTypography>
          <BaseTypography size="sm" weight="medium" class="text-right">
            {{ formatNumber(item.userShareCount) }}주 ({{
              formatNumber(item.userShareCount * item.shareAmount)
            }}원)
          </BaseTypography>
        </div>

        <!-- 보유 포인트 -->
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center space-x-1">
            <span class="material-symbols-outlined"> local_atm</span>
            <BaseTypography size="base" weight="bold">보유 포인트</BaseTypography>
          </div>

          <div class="flex items-center space-x-2">
            <BaseTypography size="base" weight="bold">
              {{ formatNumber(Number(item.userPoints ?? 0)) }}원
            </BaseTypography>
            <BaseButton
              variant="secondary"
              class="px-2 py-1 rounded-[10px] text-white hover:bg-gray-700 text-sm cursor-pointer"
              @click="handleCharge"
            >
              <BaseTypography size="sm" class="!text-white">충전하기</BaseTypography>
            </BaseButton>
          </div>
        </div>

        <!-- 수량 및 금액 변화 표시 -->
        <div class="flex justify-end items-center gap-8 text-sm mt-2 font-bold">
          <BaseTypography class="!text-blue-600"
            >+{{ formatNumber(quantity || 0) }}주</BaseTypography
          >
          <BaseTypography class="!text-red-500">-{{ formatNumber(totalPrice) }}원</BaseTypography>
        </div>
        <!-- 예측 정보 -->
        <div class="border-t pt-3 mt-3 text-base">
          <div class="flex justify-between mb-2">
            <BaseTypography size="base" weight="medium" class="!text-gray-600"
              >예상 잔여 포인트</BaseTypography
            >
            <BaseTypography class="!font-bold">
              {{ formatNumber(Math.max(0, Number(item.userPoints ?? 0) - totalPrice)) }}원
            </BaseTypography>
          </div>
          <div class="flex justify-between">
            <BaseTypography size="base" weight="medium" class="!text-gray-600"
              >예상 총 보유 주</BaseTypography
            >
            <BaseTypography class="!font-bold">
              {{ formatNumber(item.userShareCount + Number(quantity)) }}주 ({{
                formatNumber((item.userShareCount + Number(quantity)) * item.shareAmount)
              }}원)
            </BaseTypography>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-16">
      <div class="flex justify-center">
        <BaseButton
          class="bg-white border-gray-300 text-gray-800 text-sm font-medium rounded-[10px] justify-center gap-1 hover:bg-white"
          @click="handleReset"
        >
          <BaseTypography class="cursor-pointer flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">refresh</span>
            초기화
          </BaseTypography>
        </BaseButton>
      </div>
      <BaseButton
        class="w-full py-3 text-m rounded-[10px] flex justify-center items-center text-center"
        :class="
          isLoggedIn && isStepValid && !validationState.isError
            ? '!bg-black text-white hover:bg-gray-900 cursor-pointer'
            : '!bg-gray-300 text-white cursor-not-allowed'
        "
        :disabled="!isLoggedIn || !isStepValid || validationState.isError"
        @click="handleFunding"
      >
        {{ isLoggedIn ? '펀딩하기' : '로그인 후 펀딩하기' }}
      </BaseButton>
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
          <br />주당 가격: {{ formatNumber(item.shareAmount) }}원/주 <br />구매 수량:
          {{ formatNumber(quantity) }}주 <br />총 펀딩금액: {{ formatNumber(totalPrice) }}원
          <br />예상 잔여 포인트: {{ formatNumber(Number(item.userPoints ?? 0) - totalPrice) }}원
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
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { getFundingOrderLimit, createFundingOrder } from '@/api/fundingtrade'
import { getFundingById } from '@/api/funding'
import { requestChargeMerchantUid, verifyPayment, getPointBalance } from '@/api/point'
import { useToastStore } from '@/stores/toast'

import BaseModal from '@/components/common/Modal/BaseModal.vue'
import CompletedModal from '@/components/common/Modal/CompletedModal.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import PointChargeModal from '@/components/main/PointSection/PointModal/PointChargeModal.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'

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

const isLoggedIn = computed(() => authStore.getIsLoggedIn ?? authStore.isLoggedIn)

const item = ref({
  title: '',
  shareAmount: 5000,
  userPoints: 0,
  userShareCount: 0,
  remainingAmount: 0,
  remainingShares: 0,
})

// 실제 수량 (숫자)
const quantity = ref(0)
// 화면에 표시되는 수량 (콤마 포함 문자열)
const displayQuantity = ref('')
// 입력 필드 참조
const quantityInput = ref(null)

// 숫자 포맷팅 함수
const formatNumber = (num) => {
  const number = Number(num)
  return Number.isNaN(number) ? '0' : number.toLocaleString()
}

// 문자열에서 숫자만 추출
const parseNumber = (str) => {
  if (typeof str === 'number') return str
  const cleaned = String(str).replace(/[^\d]/g, '')
  return cleaned === '' ? 0 : Number(cleaned)
}

// 유효성 검사 상태
const validationState = computed(() => {
  const qty = Number(quantity.value)

  // 비어있을 때
  if (qty === 0 && displayQuantity.value === '') {
    return {
      isValid: false,
      isError: false,
      message: '구매할 수량을 입력해주세요.',
    }
  }

  // 음수일 때
  if (qty < 0) {
    return {
      isValid: false,
      isError: true,
      message: '수량은 0보다 큰 값을 입력해주세요.',
    }
  }

  // 0일 때
  if (qty === 0) {
    return {
      isValid: false,
      isError: true,
      message: '최소 1주 이상 입력해주세요.',
    }
  }

  // 잔여 주식보다 많을 때
  if (qty > item.value.remainingShares) {
    return {
      isValid: false,
      isError: true,
      message: `최대 ${formatNumber(item.value.remainingShares)}주까지 구매 가능합니다.`,
    }
  }

  // 포인트 부족할 때
  const totalCost = qty * item.value.shareAmount
  if (totalCost > Number(item.value.userPoints || 0)) {
    return {
      isValid: false,
      isError: true,
      message: '보유 포인트가 부족합니다.',
    }
  }

  // 유효한 경우
  return {
    isValid: true,
    isError: false,
    message: `총 ${formatNumber(qty * item.value.shareAmount)}원이 차감됩니다.`,
  }
})

const totalPrice = computed(() => Number(quantity.value || 0) * Number(item.value.shareAmount))

// 수량 입력 핸들러
const handleQuantityInput = (event) => {
  const inputValue = event.target.value
  const numericValue = parseNumber(inputValue)

  quantity.value = numericValue
  displayQuantity.value = numericValue === 0 ? '' : formatNumber(numericValue)

  // 커서 위치 유지
  nextTick(() => {
    if (quantityInput.value) {
      const cursorPos = quantityInput.value.value.length
      quantityInput.value.setSelectionRange(cursorPos, cursorPos)
    }
  })
}

// 포커스 시 숫자만 표시
const handleQuantityFocus = () => {
  if (quantity.value === 0) {
    displayQuantity.value = ''
  } else {
    displayQuantity.value = String(quantity.value)
  }
}

// 블러 시 콤마 표시
const handleQuantityBlur = () => {
  if (quantity.value === 0) {
    displayQuantity.value = ''
  } else {
    displayQuantity.value = formatNumber(quantity.value)
  }
}

const addShares = (n) => {
  const newQuantity = Number(quantity.value || 0) + n
  quantity.value = Math.max(0, newQuantity)
  displayQuantity.value = quantity.value === 0 ? '' : formatNumber(quantity.value)
}

const handleReset = () => {
  quantity.value = 0
  displayQuantity.value = ''
}

const handleCharge = () => {
  isChargeModalOpen.value = true
}

const handleFunding = () => {
  if (!isStepValid.value) {
    toast.show('구매할 수량을 입력해주세요.')
    return
  }

  if (validationState.value.isError) {
    toast.warn(validationState.value.message)
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
      shareCount: Number(quantity.value), // 숫자로 전송
    }
    console.log('[REQ] funding-order', payload)

    const res = await createFundingOrder(payload)
    console.log('[RES] funding-order (normalized)', res)

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

const isStepValid = computed(() => {
  return Number(quantity.value) > 0 && !validationState.value.isError
})

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
  } catch (e) {
    console.error('포인트 갱신 실패:', e)
  }
}

const onChargeSubmit = async () => {
  await nextTick()
  const amt = Number(chargeAmount.value)
  if (!Number.isFinite(amt) || amt <= 0) {
    toast.warn('충전할 금액을 입력해주세요.')
    return
  }
  await requestPay(amt)
}

const requestPay = async (amount) => {
  if (!getIsLoggedIn.value) return toast.warn('로그인이 필요합니다.')
  const amt = Number(amount)
  if (!Number.isFinite(amt) || amt <= 0) return toast.warn('충전할 금액을 입력해주세요.')

  try {
    const merchant_uid = await requestChargeMerchantUid(amt)
    if (!merchant_uid) return toast.error('결제 식별자(merchant_uid) 발급 실패')

    const { IMP } = window
    if (!IMP) return toast.error('PortOne 스크립트가 로드되지 않았습니다.')
    if (!import.meta.env.VITE_PORTONE_IMP_KEY)
      return toast.error('포트원 키가 설정되지 않았습니다. VITE_PORTONE_IMP_KEY 확인')

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
          toast.error({
            title: '결제 실패',
            body: rsp?.error_msg || '사용자 취소 또는 오류',
          })
          return
        }
        try {
          await verifyPayment({
            impUid: rsp.imp_uid,
            amount: rsp.paid_amount,
            merchantUid: merchant_uid,
          })
          toast.success('포인트 충전이 완료되었습니다.')
          isChargeModalOpen.value = false
          chargeAmount.value = 0
          await refreshPointBalance()
        } catch (err) {
          toast.error({
            title: '서버 검증 실패',
            body:
              err?.response?.data?.message || err?.message || '결제 검증 중 오류가 발생했습니다.',
          })
        }
      },
    )
  } catch (err) {
    toast.error({
      title: '결제 요청 오류',
      body: err?.response?.data?.message || err?.message || '결제 요청 중 오류가 발생했습니다.',
    })
  }
}

const loaded = ref(false)

watch(
  userId,
  async (v) => {
    const uid = Number(v)
    if (!Number.isInteger(uid)) return

    try {
      loaded.value = false

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
    } finally {
      loaded.value = true
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* 입력 필드 숫자 스피너 숨기기 */
input[type='text']::-webkit-inner-spin-button,
input[type='text']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='text'] {
  -moz-appearance: textfield;
}

/* 포커스 링 스타일링 */
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

input.border-red-500:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

input.border-green-500:focus {
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}
</style>
