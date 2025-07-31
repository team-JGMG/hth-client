<template>
  <div class="w-full max-w-md mx-auto px-4 pt-0 pb-4">
    <DetailHeader title="회원가입" class="mb-0" />

    <div class="-mt-12">
      <BaseTypography class="font-medium mt-0 mb-3 text-gray-700">
        추가 정보를 입력해주세요.
      </BaseTypography>
      <div class="py-2"></div>
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
      <div class="py-3"></div>

      <!-- 주민등록번호 -->
      <div class="mb-6 flex items-center gap-2">
        <RrnInput v-model:rrnFront="rrnFront" v-model:rrnBack="rrnBack" class="flex-1" />
        <BaseButton
          :disabled="isRrnVerified"
          @click="verifyRrn"
          class="h-[38px] px-2.5 text-xs font-medium rounded-md transition-colors duration-200"
          :class="isRrnVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isRrnVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
      </div>

      <!-- 전화번호 -->
      <div class="relative mb-6 flex items-center gap-2">
        <InputField
          v-model="phone"
          label="전화번호"
          placeholder="전화번호를 입력해주세요."
          class="flex-1"
        />
        <BaseButton
          :disabled="isPhoneVerified"
          @click="verifyPhone"
          class="h-[38px] px-2.5 text-xs font-medium rounded-md transition-colors duration-200"
          :class="isPhoneVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isPhoneVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
        <BaseTypography
          v-if="phone && !isPhoneValid"
          class="absolute !text-red-500 text-sm -mt-4 left-0 top-full !font-normal"
        >
          정확한 전화번호를 입력해주세요.
        </BaseTypography>
      </div>
      <div class="py-1"></div>
      <!-- 계좌번호 -->
      <!-- 계좌번호 -->
      <div class="mb-6 flex items-center gap-2">
        <BankAccountInput
          v-model:accountNumber="accountNumber"
          v-model:bankCode="bankCode"
          class="flex-1"
        />
        <BaseButton
          :disabled="isAccountVerified"
          @click="verifyAccount"
          class="h-[38px] -mt-4 px-2.5 text-xs font-medium rounded-md transition-colors duration-200"
          :class="isAccountVerified ? 'bg-gray-400 text-white' : 'bg-gray-800 text-white'"
        >
          {{ isAccountVerified ? '인증완료' : '인증하기' }}
        </BaseButton>
      </div>
      <!-- 약관 동의 영역 -->
      <div class="mb-10">
        <BaseTypography class="block font-medium mb-2">약관 동의</BaseTypography>

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
import { useRouter } from 'vue-router'
import InputField from '@/components/auth/InputField.vue'
import BankAccountInput from '@/components/auth/BankAccountInput.vue'
import RrnInput from '@/components/auth/RrnInput.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '../common/Button/BaseButton.vue'
import { signUpWithPreAuth } from '@/api/auth'
const router = useRouter()
const isRrnVerified = ref(false)
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
const verifyRrn = () => {
  if (isRrnValid.value) {
    isRrnVerified.value = true
  }
}

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
      name: nickname.value, // nickname → name으로 변경
      ssn: rrnFront.value + '-' + rrnBack.value, // 주민번호 조합
      phone: phone.value,
      bankCode: bankCode.value,
      accountNumber: accountNumber.value,
    }

    const { data } = await signUpWithPreAuth(userInfo)

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    router.push('/')
  } catch (e) {
    console.error('회원가입 실패:', e)
  }
}
</script>

<style scoped>
.check-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #999;
  border-radius: 50%;
  background-color: rgb(207, 207, 207);
  position: relative;
}
.check-circle.checked {
  background-color: black;
  border-color: black;
}
.check-circle.checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 6px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.chevron-btn {
  font-size: 20px;
  padding: 0 5px;
  background: none;
  border: none;
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #d3dae8; /* ← 여기 수정됨 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
