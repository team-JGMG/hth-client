<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] text-center">
    <div class="relative w-full h-80 top-5">
      <img
        src="@/assets/images/character/onboarding2.png"
        alt="집뒤"
        class="w-56 absolute top-40 left-1"
      />
      <img
        src="@/assets/images/character/onboarding1.png"
        alt="집옆"
        class="w-36 absolute top-12 right-12"
        style="transform: scaleX(-1) rotate(10deg)"
      />
      <!--
      </transition>

      <transition name="slide-fade" appear>
      -->
      <!-- 로고 + 앱 화면 영역 전체 주석 처리 -->
      <!--
        <div v-if="show3" class="flex flex-col items-end mr-4 absolute inset-0 justify-center">
          <img
            src="@/assets/images/logo/longlogo.png"
            alt="로고"
            class="w-44 h-auto mt-16"
            @error="handleImageError"
          />

          <div class="mt-0 self-start">
            <img
              src="@/assets/images/mockup.png"
              alt="앱 화면"
              class="w-[250px] max-w-full h-auto mb-4"
              @error="handleImageError"
            />
          </div>
        </div>
        -->
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

defineOptions({ name: 'OnboardingStep1' })
</script>
