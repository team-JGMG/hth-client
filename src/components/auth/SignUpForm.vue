//signUpForm.vue
<template>
  <div class="w-full max-w-md mx-auto px-4">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      추가 정보를 입력해주세요.
    </BaseTypography>

    <!-- 이름 -->
    <div class="mb-12 relative">
      <InputField
        v-model="nickname"
        label="이름"
        placeholder="이름을 입력해주세요."
        @focus="touched.nickname = true"
      />
      <BaseTypography
        v-if="touched.nickname && !isNicknameValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 주민등록번호 -->
    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <RrnInput v-model:rrnFront="rrnFront" v-model:rrnBack="rrnBack" class="flex-1" />
        </div>
        <!-- <BaseButton
          :disabled="isRrnVerified"
          @click="verifyRrn"
          class="h-[38px] bg-gray-600 hover:bg-gray-600 text-sm self-end"
          :class="isRrnVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isRrnVerified ? '인증완료' : '인증하기' }}
        </BaseButton> -->
      </div>
    </div>

    <!-- 전화번호 -->
    <div class="mb-12 relative">
      <div class="flex items-center gap-3">
        <InputField
          v-model="phone"
          label="전화번호"
          placeholder="전화번호를 입력해주세요."
          class="flex-1 h-[50px] p-0"
        />
        <BaseButton
          :disabled="isPhoneVerified"
          @click="verifyPhone"
          class="h-[38px] bg-gray-600 hover:bg-gray-600 text-sm self-end"
          :class="isPhoneVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isPhoneVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
      </div>
      <BaseTypography
        v-if="phone && !isPhoneValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 정확한 전화번호를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 계좌번호 -->
    <div class="mb-12 relative">
      <div class="flex items-center gap-3">
        <BankAccountInput
          v-model:accountNumber="accountNumber"
          v-model:bankCode="bankCode"
          class="flex-1 h-[65px] p-0"
        />
        <BaseButton
          :disabled="isAccountVerified"
          @click="verifyAccount"
          class="h-[38px] bg-gray-600 hover:bg-gray-600 text-sm self-end"
          :class="isAccountVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isAccountVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
      </div>
    </div>

    <!-- 약관 동의 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2" weight="semibold">약관 동의</BaseTypography>

      <!-- 전체 동의 -->
      <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
        <span
          class="material-symbols-outlined text-lg rounded-full border-gray-400 w-5 h-5 flex items-center justify-center"
          :class="agreements.terms ? 'bg-black text-white' : 'bg-gray-300 text-white'"
        >
          check
        </span>
        <span class="ml-2 text-sm">전체 동의합니다.</span>
      </div>

      <hr class="mb-3" />

      <!-- 개별 약관 항목 -->
      <ul class="space-y-2 text-sm text-gray-800">
        <!-- 이용약관 -->
        <li class="flex items-center justify-between">
          <div class="flex items-center cursor-pointer" @click="toggleAgreement('terms')">
            <span
              class="material-symbols-outlined text-lg rounded-full border-gray-400 w-5 h-5 flex items-center justify-center"
              :class="agreements.terms ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">이용약관에 동의합니다. (필수)</span>
          </div>
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('terms')"
          >
            arrow_forward_ios
          </span>
        </li>

        <!-- 개인정보 수집 -->
        <li class="flex items-center justify-between">
          <div class="flex items-center cursor-pointer" @click="toggleAgreement('privacy')">
            <span
              class="material-symbols-outlined text-lg rounded-full border-gray-400 w-5 h-5 flex items-center justify-center"
              :class="agreements.privacy ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">개인정보 수집 및 이용에 동의합니다. (필수)</span>
          </div>
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('privacy')"
          >
            arrow_forward_ios
          </span>
        </li>

        <!-- 만 14세 이상 -->
        <li class="flex items-center justify-between">
          <div class="flex items-center cursor-pointer" @click="toggleAgreement('age')">
            <span
              class="material-symbols-outlined text-lg rounded-full border-gray-400 w-5 h-5 flex items-center justify-center"
              :class="agreements.age ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">만 14세 이상입니다. (필수)</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 다음 버튼 -->
    <div class="mt-6 mb-20">
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

    <!-- 모달 -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            {{
              activeModal === 'terms'
                ? '이용약관'
                : activeModal === 'privacy'
                  ? '개인정보 처리방침'
                  : '만 14세 이상 확인'
            }}
          </h3>
          <button @click="closeModal" class="text-gray-500 text-xl">&times;</button>
        </div>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">
          {{ modalText[activeModal] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' // ✅ 이 순서로 선언
import InputField from '@/components/auth/InputField.vue'
import BankAccountInput from '@/components/auth/BankAccountInput.vue'
import RrnInput from '@/components/auth/RrnInput.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '../common/Button/BaseButton.vue'
import { signUpWithPreAuth } from '@/api/auth'

const router = useRouter()
const route = useRoute()

const preauthToken = route.query.preauthToken

// const isRrnVerified = ref(false)
const isPhoneVerified = ref(false)
const isAccountVerified = ref(false)
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

const allChecked = computed(
  () => agreements.value.terms && agreements.value.privacy && agreements.value.age,
)
const isFormValid = computed(
  () =>
    isNicknameValid.value &&
    isRrnValid.value &&
    isPhoneValid.value &&
    isAccountValid.value &&
    allChecked.value,
)

const touched = ref({
  name: false,
  phone: false,
  email: false,
})

const modalText = {
  terms: '여기에 이용약관 내용을 작성하세요.\n\n예시: 이 서비스는 ...',
  privacy: '여기에 개인정보 수집 및 이용에 대한 내용을 작성하세요.',
}

const openModal = (key) => {
  activeModal.value = key
  modalVisible.value = true
}
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
// const verifyRrn = () => {
//   if (isRrnValid.value) {
//     isRrnVerified.value = true
//   }
// }

const verifyPhone = () => {
  // 여기에 실제 인증 로직 넣으세요
  isPhoneVerified.value = true
}

const verifyAccount = () => {
  // 여기에 실제 인증 로직 넣으세요
  isAccountVerified.value = true
}
// 모달
const modalVisible = ref(false)
const activeModal = ref('')
// const openModal = (key) => {
//   activeModal.value = key
//   modalVisible.value = true
// }
const closeModal = () => {
  modalVisible.value = false
}

const toggleAll = () => {
  const next = !allChecked.value
  agreements.value.terms = next
  agreements.value.privacy = next
  agreements.value.age = next
}
const toggleAgreement = (key) => {
  agreements.value[key] = !agreements.value[key]
}

const handleSubmit = async () => {
  try {
    const userInfo = {
      accountNumber: accountNumber.value,
      bankCode: bankCode.value,
      name: nickname.value,
      phone: phone.value,
      ssn: rrnFront.value + rrnBack.value,
    }
    console.log('preauthToken:', preauthToken)
    console.log('userInfo 보내는 값:', userInfo)
    const { data } = await signUpWithPreAuth(userInfo)

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    router.push('/')
  } catch (e) {
    console.error('회원가입 실패:', e)
    alert('회원가입에 실패했습니다. 다시 시도해주세요.')
  }
}
</script>
