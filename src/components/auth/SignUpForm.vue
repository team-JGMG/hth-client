<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/auth/InputField.vue'
import BankAccountInput from '@/components/auth/BankAccountInput.vue'
import RrnInput from '@/components/auth/RrnInput.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const router = useRouter()

const nickname = ref('')
const rrnFront = ref('')
const rrnBack = ref('')
const phone = ref('')
const accountNumber = ref('')
const bankCode = ref('KB')
const agreedAll = ref(false)
const agreements = ref({ terms: false, privacy: false, age: false })

const isNicknameValid = computed(() => nickname.value.trim().length > 0)
const isRrnValid = computed(() => /^\d{6}$/.test(rrnFront.value) && /^\d{7}$/.test(rrnBack.value))
const isPhoneValid = computed(() => /^01[0-9]{8,9}$/.test(phone.value))
const isAccountValid = computed(() => /^\d{6,20}$/.test(accountNumber.value.trim()))

const allAgreed = computed(
  () => agreements.value.terms && agreements.value.privacy && agreements.value.age,
)
const isFormValid = computed(
  () =>
    isNicknameValid.value &&
    isRrnValid.value &&
    isPhoneValid.value &&
    isAccountValid.value &&
    allAgreed.value,
)

watch(agreedAll, (newVal) => {
  agreements.value.terms = newVal
  agreements.value.privacy = newVal
  agreements.value.age = newVal
})
watch(
  agreements,
  (newVal) => {
    agreedAll.value = newVal.terms && newVal.privacy && newVal.age
  },
  { deep: true },
)

// 스크롤 조건 제어
const scrollContainer = ref(null)
const shouldScroll = ref(false)

const updateScrollStatus = () => {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  shouldScroll.value = el.scrollHeight > el.clientHeight
}

onMounted(() => {
  nextTick(() => {
    updateScrollStatus()
    window.addEventListener('resize', updateScrollStatus)
  })
})

watch(
  () => [nickname.value, rrnFront.value, rrnBack.value, phone.value, accountNumber.value],
  () => nextTick(updateScrollStatus),
)

const handleSubmit = () => {
  if (!isFormValid.value) return
  console.log('회원가입 정보 전송:', {
    nickname: nickname.value,
    rrn: rrnFront.value + rrnBack.value,
    phone: phone.value,
    account_number: accountNumber.value,
    bank_code: bankCode.value,
  })

  router.push('/auth/login')
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <div
      ref="scrollContainer"
      :class="[
        'flex-1 px-4 pt-6 pb-24 max-w-md mx-auto w-full',
        shouldScroll ? 'overflow-y-auto' : 'overflow-hidden',
      ]"
    >
      <BaseTypography class="text-xl font-bold mb-2">회원 가입</BaseTypography>
      <BaseTypography class="text-sm mb-6 text-gray-700">추가 정보를 입력해주세요.</BaseTypography>

      <!-- 이름 -->
      <div class="relative mb-6">
        <InputField v-model="nickname" label="이름" placeholder="이름을 입력해주세요." />
        <BaseTypography
          v-if="nickname && !isNicknameValid"
          class="absolute text-red-500 text-sm mt-1 left-0 top-full"
        >
          이름을 입력해주세요.
        </BaseTypography>
      </div>

      <!-- 주민등록번호 -->
      <div class="relative mb-6">
        <RrnInput v-model:rrnFront="rrnFront" v-model:rrnBack="rrnBack" />
      </div>

      <!-- 전화번호 -->
      <div class="relative mb-6">
        <InputField v-model="phone" label="전화번호" placeholder="전화번호를 입력해주세요." />
        <BaseTypography
          v-if="phone && !isPhoneValid"
          class="absolute text-red-500 text-sm mt-1 left-0 top-full"
        >
          정확한 전화번호를 입력해주세요.
        </BaseTypography>
      </div>

      <!-- 계좌번호 -->
      <div class="relative mb-6">
        <BankAccountInput v-model:accountNumber="accountNumber" v-model:bankCode="bankCode" />
      </div>

      <!-- 약관 동의 -->
      <div class="mb-10">
        <BaseTypography class="block font-medium mb-2">약관 동의</BaseTypography>
        <div class="flex items-center mb-2">
          <input type="checkbox" v-model="agreedAll" class="mr-2" />
          <BaseTypography>전체 동의합니다.</BaseTypography>
        </div>
        <ul class="text-sm space-y-1 pl-6 text-gray-700">
          <li class="flex items-center">
            <input type="checkbox" v-model="agreements.terms" class="mr-2" />
            <BaseTypography>이용약관에 동의합니다. (필수)</BaseTypography>
          </li>
          <li class="flex items-center">
            <input type="checkbox" v-model="agreements.privacy" class="mr-2" />
            <BaseTypography>개인정보 수집 및 이용에 동의합니다. (필수)</BaseTypography>
          </li>
          <li class="flex items-center">
            <input type="checkbox" v-model="agreements.age" class="mr-2" />
            <BaseTypography>만 14세 이상입니다. (필수)</BaseTypography>
          </li>
        </ul>
      </div>

      <!-- 다음 버튼 -->
      <div class="mt-6">
        <button
          :disabled="!isFormValid"
          @click="handleSubmit"
          :class="[
            'w-full py-3 rounded font-semibold text-white transition-colors duration-300',
            isFormValid ? 'bg-black cursor-pointer' : 'bg-gray-300 cursor-not-allowed',
          ]"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>
