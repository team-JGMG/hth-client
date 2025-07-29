<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6">
      매물의 건축물 대장 정보를 입력해주세요.
    </BaseTypography>

    <!-- 용도 지역 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-1">용도 지역</BaseTypography>
      <InputSelect
        v-model="store.propertyBuilding.landUsageZone"
        placeholder="용도 지역을 선택해주세요."
        :options="landUsageZoneTypes"
        class="text-base"
      />
      <BaseTypography
        v-if="submitTried && !store.propertyBuilding.landUsageZone"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다. 용도 지역을 선택해주세요.
      </BaseTypography>
    </div>

    <!-- 대지 면적 -->
    <div class="mb-12">
      <BaseTypography class="mb-1">대지 면적</BaseTypography>
      <div class="relative">
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> house </span>
          <span class="text-base text-black -translate-y-2">매물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.landSize"
              placeholder="매물 면적을 입력해주세요."
              type="number"
            />
          </div>
          <span class="text-base text-black mr-4 -translate-y-2">㎡</span>
        </div>
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> apartment </span>
          <span class="text-base text-black -translate-y-2">건물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.buildingSize"
              placeholder="건물 면적을 입력해주세요."
              type="number"
            />
          </div>
          <span class="text-base text-black mr-4 -translate-y-2">㎡</span>
        </div>
        <BaseTypography
          v-if="
            submitTried &&
            (!isNumber(store.propertyBuilding.landSize) ||
              !isNumber(store.propertyBuilding.buildingSize))
          "
          color="red-1"
          size="xs"
          class="absolute mt-1 left-0 top-full"
        >
          * 숫자를 입력해주세요.
        </BaseTypography>
      </div>
    </div>

    <!-- 연면적 -->
    <div class="mb-12">
      <BaseTypography class="mb-1">연면적</BaseTypography>
      <div class="relative">
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> house </span>
          <span class="text-base text-black -translate-y-2">매물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.landTotalArea"
              placeholder="매물 면적을 입력해주세요."
              type="number"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> apartment </span>
          <span class="text-base text-black -translate-y-2">건물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.buildingTotalArea"
              placeholder="건물 면적을 입력해주세요."
              type="number"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <BaseTypography
          v-if="
            submitTried &&
            (!isNumber(store.propertyBuilding.landTotalArea) ||
              !isNumber(store.propertyBuilding.buildingTotalArea))
          "
          color="red-1"
          size="xs"
          class="absolute mt-1 left-0 top-full"
        >
          * 숫자를 입력해주세요.
        </BaseTypography>
      </div>
    </div>

    <!-- 건물 규모 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">건물 규모</BaseTypography>
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined -translate-y-2"> arrow_circle_down </span>
        <InputField
          v-model="store.propertyBuilding.floorUnder"
          icon="unfold_less"
          placeholder="지하 층 수"
          type="number"
        />
        <span class="text-base text-black -translate-y-2 mr-4">층</span>
        <span class="material-symbols-outlined -translate-y-2"> arrow_circle_up </span>
        <InputField
          v-model="store.propertyBuilding.floorAbove"
          icon="unfold_more"
          placeholder="지상 층 수"
          type="number"
        />
        <span class="text-base text-black -translate-y-2">층</span>
      </div>
      <BaseTypography
        v-if="
          submitTried &&
          (!isNumber(store.propertyBuilding.floorUnder) ||
            !isNumber(store.propertyBuilding.floorAbove))
        "
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 숫자를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 준공일 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">준공일</BaseTypography>
      <InputField
        v-model="store.propertyBuilding.builtDate"
        type="date"
        placeholder="날짜를 입력해주세요."
      />
      <BaseTypography
        v-if="submitTried && !store.propertyBuilding.builtDate"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 날짜를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 공시지가 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">공시지가</BaseTypography>
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBuilding.officialPrice"
            placeholder="금액을 입력해주세요."
            type="number"
          />
        </div>
        <span class="text-base text-black -translate-y-1 relative">원/㎡</span>
      </div>
      <BaseTypography
        v-if="submitTried && !isNumber(store.propertyBuilding.officialPrice)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 숫자를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 연면적 평단가 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">연면적 평단가 (평/공모금액 기준)</BaseTypography>
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBuilding.marketPrice"
            placeholder="금액을 입력해주세요."
            type="number"
          />
        </div>
        <span class="text-base text-black -translate-y-2">원</span>
      </div>
      <BaseTypography
        v-if="submitTried && !isNumber(store.propertyBuilding.marketPrice)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 숫자를 입력해주세요.
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
import { ref, computed } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import InputSelect from '@/components/common/Select/InputSelect.vue'

const store = usePropertyRegisterStore()
const submitTried = ref(false)

const landUsageZoneTypes = ['주거지역', '상업지역', '기타']

const isNumber = (value) => {
  return /^[0-9]+$/.test(value)
}

const isStepValid = computed(() => {
  const b = store.propertyBuilding
  return (
    b.landUsageZone &&
    isNumber(b.landSize) &&
    isNumber(b.buildingSize) &&
    isNumber(b.landTotalArea) &&
    isNumber(b.buildingTotalArea) &&
    isNumber(b.floorUnder) &&
    isNumber(b.floorAbove) &&
    b.builtDate &&
    isNumber(b.officialPrice) &&
    isNumber(b.marketPrice)
  )
})

const handleNext = () => {
  submitTried.value = true
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
