<template>
  <div class="w-full max-w-md mx-auto px-4 pb-8">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      매도자 정보를 확인해주세요.
    </BaseTypography>

    <div class="mb-10 relative">
      <label class="text-base font-medium">이름</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.name ? store.ownerInfo.name : '-' }}
      </div>
    </div>

    <div class="mb-12 relative">
      <label class="text-base font-medium">전화번호</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.phone ? formatPhoneNumber(store.ownerInfo.phone) : '-' }}
      </div>
    </div>

    <div class="mb-12 relative">
      <label class="text-base font-medium">이메일</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.email ? store.ownerInfo.email : '-' }}
      </div>
    </div>

    <div class="mb-10 relative">
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

    <div class="pb-12">
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
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
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
  } catch {
    toast.error({
      title: '자동완성 실패',
      body: '자동완성에 실패했습니다. 로그인 상태를 확인해주세요.',
    })
  }
})

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
