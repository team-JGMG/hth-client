<template>
  <div class="w-full max-w-md mx-auto px-4">
    <BaseTypography class="text-xl font-bold mb-6">매도자 정보를 입력해주세요.</BaseTypography>

    <!-- 이름 -->
    <div class="mb-12 relative">
      <InputField v-model="store.ownerInfo.name" label="이름" placeholder="이름을 입력해주세요." />
      <BaseTypography
        v-if="submitTried && !isNameValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 전화번호 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.ownerInfo.phone"
        label="전화번호"
        placeholder="전화번호를 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !isPhoneValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ isPhoneEmpty ? '* 필수 항목입니다.' : '* 전화번호 형식에 맞지 않습니다.' }}
      </BaseTypography>
    </div>

    <!-- 이메일 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.ownerInfo.email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !isEmailValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ isEmailEmpty ? '* 필수 항목입니다.' : '* 이메일 형식에 맞지 않습니다.' }}
      </BaseTypography>
    </div>

    <!-- 약관 동의 -->
    <div class="mb-12 relative">
      <BaseTypography class="font-semibold mb-2">약관 동의</BaseTypography>

      <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
        <span
          class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
          :class="allChecked ? 'bg-black text-white' : 'bg-gray-300 text-white'"
        >
          check
        </span>
        <span class="ml-2 text-sm">전체 동의합니다.</span>
      </div>

      <ul class="space-y-1 text-sm text-gray-800">
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('terms')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.terms ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">이용약관에 동의 합니다. (필수)</span>
          </div>
          <span class="material-symbols-outlined text-base text-gray-400">chevron_right</span>
        </li>
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('privacy')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.privacy ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">개인정보 수집 및 이용에 동의합니다. (필수)</span>
          </div>
          <span class="material-symbols-outlined text-base text-gray-400">chevron_right</span>
        </li>
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('age')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.age ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">만 14세 이상입니다. (필수)</span>
          </div>
        </li>
      </ul>

      <BaseTypography
        v-if="submitTried && !allChecked"
        color="red-1"
        size="xs"
        class="absolute mt-2 left-0 top-full"
      >
        * 모든 약관에 동의해주세요.
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <div class="pb-28">
      <BaseButton
        class="w-full py-3 rounded font-semibold"
        :class="isFormValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'"
        @click="handleSubmit"
      >
        다음
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const store = usePropertyRegisterStore()
const submitTried = ref(false)

const agreements = store.ownerInfo.agreements

const toggle = (key) => {
  agreements[key] = !agreements[key]
}
const toggleAll = () => {
  const next = !(agreements.terms && agreements.privacy && agreements.age)
  agreements.terms = next
  agreements.privacy = next
  agreements.age = next
}
const allChecked = computed(() => agreements.terms && agreements.privacy && agreements.age)

const nameRaw = computed(() => store.ownerInfo.name.trim())
const phoneRaw = computed(() => store.ownerInfo.phone.trim())
const emailRaw = computed(() => store.ownerInfo.email.trim())

const isNameValid = computed(() => nameRaw.value.length > 0)

const isPhoneEmpty = computed(() => phoneRaw.value === '')
const isPhoneFormatWrong = computed(
  () => phoneRaw.value !== '' && !/^01[0-9]{8,9}$/.test(phoneRaw.value),
)

const isEmailEmpty = computed(() => emailRaw.value === '')
const isEmailFormatWrong = computed(
  () => emailRaw.value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw.value),
)

const isFormValid = computed(
  () =>
    isNameValid.value &&
    !isPhoneEmpty.value &&
    !isPhoneFormatWrong.value &&
    !isEmailEmpty.value &&
    !isEmailFormatWrong.value &&
    allChecked.value,
)

const handleSubmit = () => {
  submitTried.value = true
  if (isFormValid.value) {
    store.goToNextStep()
  }
}
</script>
