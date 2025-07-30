<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <div class="relative w-full h-80 top-10">
      <transition name="slide-fade-up" appear>
        <img src="@/assets/images/onboarding/onboarding4.png" alt="펀딩" class="image-center" />
      </transition>
    </div>

    <div class="mt-20">
      <BaseTypography size="2xl" weight="bold" class="mb-2 break-keep">
        펀딩 중인 매물에 투자하세요
      </BaseTypography>
      <BaseTypography size="base" color="black" class="leading-relaxed mb-12 break-keep">
        마음에 드는 매물에 투자하고 <br />
        주당 가격으로 건물 지분을 확보하세요.
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
.slide-fade-up-enter-active {
  transition:
    opacity 0.3s ease-out 0.1s,
    transform 0.3s ease-out 0.1s;
}
.slide-fade-up-enter-from {
  opacity: 0;
  transform: translate(-50%, -30%);
}
.slide-fade-up-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%);
}
</style>
