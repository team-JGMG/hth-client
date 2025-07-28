<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6">
      매물의 건축물 대장 정보를 입력해주세요.
    </BaseTypography>

    <!-- 용도 지역 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBuilding.landUsageZone"
        label="용도 지역"
        placeholder="용도 지역을 선택해주세요."
      />
      <BaseTypography
        v-if="submitTried && !store.propertyBuilding.landUsageZone"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 대지 면적 -->
    <div class="mb-12">
      <BaseTypography class="mb-1 text-sm">대지 면적</BaseTypography>
      <div class="space-y-2 relative">
        <InputField
          v-model="store.propertyBuilding.landSize"
          icon="location_city"
          placeholder="매물 면적을 입력해주세요."
          unit="m²"
          type="number"
        />
        <InputField
          v-model="store.propertyBuilding.buildingSize"
          icon="apartment"
          placeholder="건물 면적을 입력해주세요."
          unit="m²"
          type="number"
        />
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
      <BaseTypography class="mb-1 text-sm">연면적</BaseTypography>
      <div class="space-y-2 relative">
        <InputField
          v-model="store.propertyBuilding.landTotalArea"
          icon="location_city"
          placeholder="매물 면적을 입력해주세요."
          unit="m²"
          type="number"
        />
        <InputField
          v-model="store.propertyBuilding.buildingTotalArea"
          icon="apartment"
          placeholder="건물 면적을 입력해주세요."
          unit="m²"
          type="number"
        />
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
      <BaseTypography class="mb-2 text-sm">건물 규모</BaseTypography>
      <div class="flex items-center gap-4">
        <InputField
          v-model="store.propertyBuilding.floorUnder"
          icon="unfold_less"
          placeholder="지하 층 수"
          type="number"
        />
        <InputField
          v-model="store.propertyBuilding.floorAbove"
          icon="unfold_more"
          placeholder="지상 층 수"
          type="number"
        />
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
      <InputField
        v-model="store.propertyBuilding.builtDate"
        label="준공일"
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
      <InputField
        v-model="store.propertyBuilding.officialPrice"
        label="공시지가"
        placeholder="금액을 입력해주세요."
        unit="₩/m²"
        type="number"
      />
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
      <InputField
        v-model="store.propertyBuilding.marketPrice"
        label="연면적 평단가 (평/공모금액 기준)"
        placeholder="금액을 입력해주세요."
        unit="₩"
        type="number"
      />
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
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

const store = usePropertyRegisterStore()
const submitTried = ref(false)

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
