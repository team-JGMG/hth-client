<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <div class="relative w-full h-80 top-12">
      <img
        src="@/assets/images/onboarding/onboarding7.png"
        alt="펀딩"
        class="w-48 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>

    <div class="mt-20">
      <BaseTypography size="2xl" weight="bold" class="mb-2 break-keep"
        >펀딩 완료 후, 실시간 거래도 가능!</BaseTypography
      >
      <BaseTypography size="base" color="black" class="leading-relaxed mb-12">
        펀딩 완료된 매물은 거래소에서<br />
        실시간으로 매도/매수가 가능합니다.
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineOptions({ name: 'OnboardingStep1' })
</script>

<style scoped>
.image-center {
  @apply w-[260px] absolute left-1/2 top-2/3;
  transform: translate(-50%, -50%);
}
</style>
