<template>
  <div
    class="border rounded-xl p-6 bg-white text-center min-h-[600px] flex flex-col justify-center"
  >
    <img src="@/assets/images/logo.png" alt="logo" class="w-16 h-16 mx-auto mb-4" />
    <BaseTypography class="font-semibold mb-2">
      당신만의 부동산 포트폴리오를 시작할 시간!
    </BaseTypography>
    <BaseTypography class="text-sm text-gray-600"> 다양한 투자 매물을 탐색해보세요 </BaseTypography>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
</script>
