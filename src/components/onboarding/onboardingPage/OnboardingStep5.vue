<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <!-- 애니메이션 영역 -->
    <div class="relative w-full h-96 top-10">
      <!-- 1번 이미지 -->
      <transition name="fade" appear>
        <img
          v-if="show1"
          src="@/assets/images/character/onboarding2.png"
          alt="집앞"
          class="w-60 absolute top-[160px] right-[80px]"
        />
      </transition>

      <!-- 2번 이미지 -->
      <transition name="fade" appear>
        <img
          v-if="show2"
          src="@/assets/images/character/onboarding1.png"
          alt="집옆"
          class="w-28 absolute top-[40px] right-[20px]"
        />
      </transition>

      <!-- 3번: 로고 + 목업 이미지 -->
      <transition name="slide-fade" appear>
        <div v-if="show3" class="flex flex-col items-center gap-3 absolute inset-0 justify-center">
          <!-- 로고 -->
          <img
            src="@/assets/images/logo/longlogo.svg"
            alt="로고"
            class="w-32 h-auto mt-32"
            @error="handleImageError"
          />

          <!-- 목업 이미지 -->
          <div class="mt-8">
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

    <!-- 고정된 텍스트 (항상 표시) -->
    <div class="mt-20">
      <BaseTypography size="xl" weight="bold" class="mb-2 break-keep"
        >매도도 간편하게, 시세 차익까지!</BaseTypography
      >
      <BaseTypography size="sm" color="gray-1" class="leading-relaxed mb-6">
        시세보다 높은 가격에 매도하고<br />
        투자 수익을 실현해보세요.
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

// 이미지 로드 에러 핸들링
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
/* 기본 페이드 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 위로 올라오며 페이드 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* 애니메이션 영역 제한 */
.animation-container {
  overflow: hidden;
}

img {
  display: block;
}
</style>
