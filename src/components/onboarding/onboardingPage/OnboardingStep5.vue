<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <div class="relative w-full h-80 top-12">
      <img
        src="@/assets/images/onboarding/onboarding8.png"
        alt="펀딩"
        class="w-56 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>

    <div class="mt-20">
      <BaseTypography size="2xl" weight="bold" class="mb-2 break-keep"
        >매도도 간편하게, 시세 차익까지!</BaseTypography
      >
      <BaseTypography size="base" color="black" class="leading-relaxed mb-12">
        시세보다 높은 가격에 매도하고<br />
        투자 수익을 실현해보세요.
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
