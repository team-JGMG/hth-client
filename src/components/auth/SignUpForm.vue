회원가입의 알람 추가 //signUpForm.vue
<template>
  <div class="w-full max-w-md mx-auto px-4">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      추가 정보를 입력해주세요.
    </BaseTypography>

    <div class="mb-12 relative">
      <InputField
        v-model="nickname"
        label="이름"
        placeholder="이름을 입력해주세요."
        @focus="touched.nickname = true"
        @blur="touched.nickname = true"
      />

      <BaseTypography
        v-if="touched.nickname && !isNicknameValid && nickname.length > 0"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <RrnInput
            v-model:rrnFront="rrnFront"
            v-model:rrnMid="rrnMid"
            v-model:rrnBack="rrnBack"
            class="flex-1"
          />
        </div>
      </div>
    </div>

    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="phone"
            label="전화번호"
            placeholder="전화번호를 입력해주세요."
            class="!w-full h-full p-0"
            maxlength="11"
            inputmode="numeric"
            pattern="\d*"
            @input="onPhoneInput"
            @focus="touched.phone = true"
          />
        </div>

        <BaseButton
          :disabled="isPhoneVerified"
          @click="verifyPhone"
          class="h-9.9 w-[80.4px] text-sm rounded-md transition-colors"
          :class="
            isPhoneVerified ? '!bg-gray-300 text-white' : 'bg-gray-800 text-white hover:bg-gray-800'
          "
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

    <div class="mb-12 relative">
      <div class="flex items-end gap-2">
        <div class="flex-[1.3]">
          <BankAccountInput
            v-model:accountNumber="accountNumber"
            v-model:bankCode="bankCode"
            class="w-full"
          />
        </div>
        <BaseButton
          :disabled="isAccountVerified"
          @click="verifyAccount"
          :class="isAccountVerified ? '!bg-gray-300 text-white' : 'bg-gray-800 text-white'"
          class="h-[38px] text-sm self-end hover:bg-gray-800 px-4 min-w-[80px] whitespace-nowrap"
        >
          {{ isAccountVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
      </div>
    </div>

    <div class="mb-12 relative">
      <BaseTypography class="mb-2" weight="semibold">약관 동의</BaseTypography>

      <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
        <span
          class="material-symbols-outlined text-lg rounded-full border-gray-400 w-5 h-5 flex items-center justify-center"
          :class="allChecked ? 'bg-black text-white' : 'bg-gray-300 text-white'"
        >
          check
        </span>
        <span class="ml-2 text-sm">전체 동의합니다.</span>
      </div>

      <hr class="mb-3" />

      <ul class="space-y-2 text-sm text-gray-800">
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
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
        </li>

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
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
        </li>

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

    <div class="mt-6 mb-20">
      <BaseButton
        :disabled="!isFormValid"
        class="w-full hover:bg-gray-800 py-3 font-semibold rounded-lg"
        :class="!isFormValid ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-white'"
        @click="handleSubmit"
      >
        다음
      </BaseButton>
    </div>

    <BaseModal :isOpen="modalVisible" @close="closeModal" @submit="agreeAndClose">
      <template #default>
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
        </div>
        <BaseTypography size="sm" color="gray-1" class="whitespace-pre-wrap">
          {{ modalText[activeModal] }}
        </BaseTypography>

        <div class="py-3"></div>
      </template>

      <template #submit>
        <BaseTypography class="!text-white font-medium text-base">동의하기</BaseTypography>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/auth/InputField.vue'
import BankAccountInput from '@/components/auth/BankAccountInput.vue'
import RrnInput from '@/components/auth/RrnInput.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import { signUpWithPreAuth } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const authStore = useAuthStore()
const agreeAndClose = () => {
  if (activeModal.value) {
    agreements.value[activeModal.value] = true
  }
  closeModal()
}
const router = useRouter()

const onPhoneInput = (e) => {
  phone.value = e.target.value.replace(/\D/g, '').slice(0, 11)
}
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

const isNicknameValid = computed(() => {
  const trimmed = nickname.value.trim()
  return /^[가-힣a-zA-Z]{2,}$/.test(trimmed)
})
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
  nickname: false,
  phone: false,
  rrn: false,
  account: false,
})
const modalText = {
  terms: `제 1 조 (목적)
본 약관은 회원이 본 서비스를 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2 조 (이용 계약의 성립)
회원 가입 시 본 약관에 동의함으로써 서비스 이용 계약이 체결됩니다.

제 3 조 (서비스의 이용)
회사는 안정적인 서비스를 제공하기 위해 노력하며, 기술적 문제 발생 시 사전 공지 후 일시 중지할 수 있습니다.

제 4 조 (회원의 의무)
회원은 타인의 정보를 도용하거나, 서비스 운영을 방해하는 행위를 해서는 안 됩니다.

제 5 조 (계약 해지 및 이용 제한)
회원은 언제든지 서비스 이용을 중단할 수 있으며, 회사는 회원이 약관을 위반할 경우 사전 통지 없이 이용을 제한할 수 있습니다.

제 6 조 (면책 조항)
회사는 천재지변, 불가항력 등으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
`,
  privacy: `1. 수집하는 항목
- 필수 항목: 이름, 전화번호, 주민등록번호, 계좌번호, 은행 코드

2. 수집 목적
- 본인 확인, 서비스 제공 및 관리, 고객 문의 응대, 부정 이용 방지

3. 보유 및 이용 기간
- 수집일로부터 회원 탈퇴 후 5일까지 (관련 법령에 따라 보관)

4. 동의 거부 권리 안내
- 사용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.
`,
}

const openModal = (key) => {
  activeModal.value = key
  modalVisible.value = true
}

watch(
  agreements,
  (newVal) => {
    agreedAll.value = newVal.terms && newVal.privacy && newVal.age
  },
  { deep: true },
)
watch(nickname, (val) => toast.show('nickname 변경됨:', val))

const verifyPhone = () => {
  setTimeout(() => {
    isPhoneVerified.value = true
    toast.success({
      title: '인증확인',
      body: '전화번호 인증이 완료되었습니다.',
    })
  }, 1000)
}

const verifyAccount = () => {
  setTimeout(() => {
    isAccountVerified.value = true
    toast.success({
      title: '인증확인',
      body: '계좌번호 인증이 완료되었습니다.',
    })
  }, 1000)
}
const modalVisible = ref(false)
const activeModal = ref('')

const closeModal = () => {
  modalVisible.value = false
}

const toggleAll = () => {
  const next = !(agreements.value.terms && agreements.value.privacy && agreements.value.age)
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

    const { data } = await signUpWithPreAuth(userInfo)

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    await authStore.loadUserInfo()

    router.push('/')
  } catch {
    toast.error({
      title: '회원가입 실패',
      body: '회원가입에 실패했습니다. 다시 시도해주세요.',
    })
  }
}
</script>
