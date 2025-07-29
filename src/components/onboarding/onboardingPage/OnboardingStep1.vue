<template>
  <div class="flex flex-col items-center justify-between min-h-[80vh] px-6 text-center">
    <!-- 이미지 -->
    <div class="relative mt-12">
      <img
        src="@/assets/images/character/onboarding1.png"
        alt="옆모습"
        class="w-64 top-[200px] right-[20px] relative"
      />
      <img
        src="@/assets/images/character/onboarding2.png"
        alt="뒷모습"
        class="w-36 absolute top-[70px] right-[-10px]"
      />
    </div>

    <!-- 텍스트 -->
    <div class="mt-10">
      <h2 class="text-xl font-bold mb-2">반의 반으로 시작하는<br />건물 투자</h2>
      <p class="text-sm text-gray-600">
        큰돈 없어도 누구나<br />
        부동산 투자, 반의 반집으로 시작해보세요.
      </p>
    </div>

    <!-- 버튼은 부모(OnboardingPage.vue)에서 공통 처리 -->
  </div>
</template>

<script setup>
defineOptions({ name: 'OnboardingStep1' })
</script>
