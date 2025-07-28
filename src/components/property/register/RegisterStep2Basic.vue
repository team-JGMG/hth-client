<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6">매물 정보를 입력해주세요.</BaseTypography>

    <!-- 매물명 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.title"
        label="매물명"
        placeholder="매물명을 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !store.propertyBasic.title.trim()"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 주소 -->
    <div class="mb-12 relative">
      <div class="flex items-center gap-1 mb-0">
        <InputField
          v-model="store.propertyBasic.zipcode"
          label="매물 주소 조회"
          placeholder="우편번호"
          class="flex-1"
          readonly
        />
        <BaseButton class="h-[38px] bg-gray-500 hover:bg-gray-600 text-sm" @click="searchAddress"
          >주소 검색</BaseButton
        >
      </div>
      <InputField
        v-model="store.propertyBasic.address"
        placeholder="주소를 입력해주세요."
        class="mt-1"
        readonly
      />
      <InputField
        v-model="store.propertyBasic.detailAddress"
        placeholder="상세주소를 입력해주세요."
        class="mt-1"
      />
      <BaseTypography
        v-if="submitTried && (!store.propertyBasic.address || !store.propertyBasic.detailAddress)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 주소 및 상세주소를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 매물 크기 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.size"
        label="매물 크기"
        placeholder="면적을 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !/^[0-9]+$/.test(store.propertyBasic.size)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 숫자만 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 희망 매매가 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.price"
        label="희망 매매가"
        placeholder="금액을 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !/^[0-9]+$/.test(store.propertyBasic.price)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 숫자만 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 공고 기간 (날짜 선택 추가 필요) -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.period"
        label="희망 공고 기간"
        type="date"
        placeholder="날짜를 선택해주세요."
      />
      <BaseTypography
        v-if="submitTried && !store.propertyBasic.period"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 날짜를 선택해주세요.
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <BaseButton
      class="w-full py-3 rounded font-semibold"
      :class="isStepValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'"
      @click="handleNext"
    >
      다음
    </BaseButton>
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

const searchAddress = () => {
  // TODO: 실제 다음 주소 API 연동
  store.propertyBasic.zipcode = '12345'
  store.propertyBasic.address = '서울시 강남구 테헤란로 123'
}

const isStepValid = computed(() => {
  const p = store.propertyBasic
  return (
    p.title.trim() &&
    p.address &&
    p.detailAddress &&
    /^[0-9]+$/.test(p.size) &&
    /^[0-9]+$/.test(p.price) &&
    !!p.period
  )
})

const handleNext = () => {
  submitTried.value = true
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
