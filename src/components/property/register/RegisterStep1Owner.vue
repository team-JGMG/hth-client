<template>
  <div class="w-full max-w-md mx-auto px-4">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      매도자 정보를 확인해주세요.
    </BaseTypography>

    <!-- 이름 -->
    <div class="mb-12 relative">
      <label class="text-base font-medium">이름</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.name ? store.ownerInfo.name : '-' }}
      </div>
      <!-- 주석 내용 : 기존 수동입력 및 유효성 처리 -->
      <!-- <InputField
        v-model="store.ownerInfo.name"
        label="이름"
        placeholder="이름을 입력해주세요."
        :readonly="true"
      />
      @focus="touched.name = true"
      <BaseTypography
        v-if="touched.name && !isNameValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography> -->
    </div>

    <!-- 전화번호 -->
    <div class="mb-12 relative">
      <label class="text-base font-medium">전화번호</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.phone ? formatPhoneNumber(store.ownerInfo.phone) : '-' }}
      </div>
      <!-- <InputField
        v-model="store.ownerInfo.phone"
        label="전화번호"
        placeholder="전화번호를 입력해주세요."
        @focus="touched.phone = true"
      />
      <BaseTypography
        v-if="touched.phone && !isPhoneValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ phoneRaw ? '* 전화번호 형식에 맞지 않습니다.' : '* 필수 항목입니다.' }}
      </BaseTypography> -->
    </div>

    <!-- 이메일 -->
    <div class="mb-12 relative">
      <label class="text-base font-medium">이메일</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.email ? store.ownerInfo.email : '-' }}
      </div>
      <!-- <InputField
        v-model="store.ownerInfo.email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        @focus="touched.email = true"
      />
      <BaseTypography
        v-if="touched.email && !isEmailValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ emailRaw ? '* 이메일 형식에 맞지 않습니다.' : '* 필수 항목입니다.' }}
      </BaseTypography> -->
    </div>

    <!-- 약관 동의 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2" weight="semibold">약관 동의</BaseTypography>

      <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
        <span
          class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
          :class="allChecked ? 'bg-black text-white' : 'bg-gray-300 text-white'"
        >
          check
        </span>
        <span class="ml-2 text-sm">전체 동의합니다.</span>
      </div>

      <hr class="mb-3" />

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
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('terms')"
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
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
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('terms')"
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
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
        v-if="isPartiallyChecked"
        color="red-1"
        size="xs"
        class="absolute mt-2 left-0 top-full"
      >
        * 모든 약관에 동의해주세요.
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <div class="pb-28">
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleNext"
      >
        다음
      </CompletedButton>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useAuthStore } from '@/stores/authStore'
import { formatPhoneNumber } from '@/utils/format'

const authStore = useAuthStore()
const store = usePropertyRegisterStore()

onMounted(async () => {
  try {
    if (!authStore.userInfo) {
      await authStore.loadUserInfo()
    }
    store.ownerInfo.name = authStore.userInfo.name
    store.ownerInfo.phone = authStore.userInfo.phone
    store.ownerInfo.email = authStore.userInfo.email
    store.ownerInfo.userId = authStore.userInfo.userId
  } catch (error) {
    console.error('자동완성 실패:', error)
    alert('자동완성에 실패했습니다. 로그인 상태를 확인해주세요.')
  }
})

//약관 동의 관련
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

const isPartiallyChecked = computed(() => {
  const count = [agreements.terms, agreements.privacy, agreements.age].filter(Boolean).length
  return count > 0 && count < 3
})

const allChecked = computed(() => agreements.terms && agreements.privacy && agreements.age)

const isStepValid = computed(() => allChecked.value)

const handleNext = () => {
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
