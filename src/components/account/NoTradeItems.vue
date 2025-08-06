<template>
  <div
    class="border rounded-xl bg-white text-center min-h-[500px] flex flex-col justify-center items-center w-full"
  >
    <img src="@/assets/images/logo.png" alt="logo" class="w-28 h-auto mb-4" />
    <BaseTypography size="sm" class="mb-2">
      아직 판매 등록된 매물이 없네요. <br />

      지금 바로 등록하고<br />
      새로운 투자 기회를 만들어보세요!
    </BaseTypography>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
</script>
