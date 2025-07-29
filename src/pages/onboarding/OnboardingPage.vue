<template>
  <Transition name="slide" mode="out-in">
    <component :is="currentComponent" :key="step" />
  </Transition>
  <StepIndicator :currentStep="step" :totalSteps="5" class="mt-6" />
  <div class="max-w-xs mx-auto">
    <CompletedButton
      color="black"
      text-color="white"
      active-color="gray-800"
      typography-weight="semibold"
      @click="nextStep"
    >
      {{ step < 5 ? '다음' : '시작하기' }}
    </CompletedButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'

import StepIndicator from '@/components/onboarding/StepIndicator.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import OnboardingStep1 from '@/components/onboarding/onboardingPage/OnboardingStep1.vue'
import OnboardingStep2 from '@/components/onboarding/onboardingPage/OnboardingStep2.vue'
import OnboardingStep3 from '@/components/onboarding/onboardingPage/OnboardingStep3.vue'
import OnboardingStep4 from '@/components/onboarding/onboardingPage/OnboardingStep4.vue'
import OnboardingStep5 from '@/components/onboarding/onboardingPage/OnboardingStep5.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const step = ref(1)

const stepComponents = [
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
]

const currentComponent = computed(() => stepComponents[step.value - 1])

const nextStep = () => {
  if (step.value < 5) {
    step.value++
  } else {
    onboardingStore.completeOnboarding()
    router.replace('/') // push도 가능, 둘 다 OK
  }
}
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
