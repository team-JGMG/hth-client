<template>
  <BlankLayout>
    <div class="w-full max-w-md mx-auto overflow-hidden relative">
      <!-- 인디케이터 -->
      <StepIndicator :currentStep="step" :totalSteps="5" />

      <!-- 단계별 컴포넌트 -->
      <transition name="slide" mode="out-in">
        <component :is="currentComponent" :key="step" />
      </transition>

      <!-- 이전/다음 버튼 -->
      <div class="mt-6 flex justify-between">
        <button @click="prevStep" :disabled="step === 1">이전</button>
        <button @click="nextStep">
          {{ step < 5 ? '다음' : '시작하기' }}
        </button>
      </div>
    </div>
  </BlankLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import BlankLayout from '@/layouts/BlankLayout.vue'
import StepIndicator from '@/components/onboarding/StepIndicator.vue'

// 👇 온보딩 스텝 컴포넌트들 직접 import
import OnboardingStep1 from '@/components/onboarding/onboardingPage/OnboardingStep1.vue'
import OnboardingStep2 from '@/components/onboarding/onboardingPage/OnboardingStep2.vue'
import OnboardingStep3 from '@/components/onboarding/onboardingPage/OnboardingStep3.vue'
import OnboardingStep4 from '@/components/onboarding/onboardingPage/OnboardingStep4.vue'
import OnboardingStep5 from '@/components/onboarding/onboardingPage/OnboardingStep5.vue'

const router = useRouter()
const step = ref(1)

// 👇 step 값에 따라 컴포넌트 객체 반환
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
    localStorage.setItem('hasVisited', 'true')
    router.push('/')
  }
}

const prevStep = () => {
  if (step.value > 1) step.value--
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
