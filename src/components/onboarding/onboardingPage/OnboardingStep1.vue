<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <div class="relative w-full h-96 top-10">
      <transition name="fade" appear>
        <img
          v-if="show1"
          src="@/assets/images/character/onboarding2.png"
          alt="집뒤"
          class="w-56 absolute top-[200px] left-[16px]"
        />
      </transition>

      <transition name="fade" appear>
        <img
          v-if="show2"
          src="@/assets/images/character/onboarding1.png"
          alt="집옆"
          class="w-36 absolute top-[80px] right-[40px]"
          style="transform: scaleX(-1) rotate(10deg)"
        />
      </transition>

      <transition name="slide-fade" appear>
        <div
          v-if="show3"
          class="flex flex-col items-end mr-6 gap-3 absolute inset-0 justify-center"
        >
          <img
            src="@/assets/images/logo/longlogo.png"
            alt="로고"
            class="w-44 h-auto mt-20"
            @error="handleImageError"
          />

          <div class="mt-8 self-start">
            <img
              src="@/assets/images/mockup.png"
              alt="앱 화면"
              class="w-[400px] max-w-full h-auto"
              @error="handleImageError"
            />
          </div>
        </div>
      </transition>
    </div>

    <div class="mt-10">
      <BaseTypography size="2xl" weight="bold" class="mb-2 break-keep"
        >반의 반으로 시작하는 건물 투자</BaseTypography
      >
      <BaseTypography size="base" color="black" class="leading-relaxed mb-12 break-keep">
        큰 돈 없이도 누구나! <br />
        부동산 투자, 반의 반집으로 시작해보세요.
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { ref, onMounted } from 'vue'

defineOptions({ name: 'OnboardingStep1' })

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)

const handleImageError = (event) => {
  console.error('이미지 로드 실패:', event.target.src)
}

onMounted(() => {
  setTimeout(() => (show1.value = true), 200)
  setTimeout(() => (show2.value = true), 800)
  setTimeout(() => {
    show1.value = false
    show2.value = false
  }, 1800)
  setTimeout(() => (show3.value = true), 2000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.animation-container {
  overflow: hidden;
}

img {
  display: block;
}
</style>
