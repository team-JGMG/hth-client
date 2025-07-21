<template>
  <div class="relative bg-black rounded-xl px-4 pt-5 pb-4 flex flex-col gap-4 text-white">
    <!-- 정보 수정 버튼 -->
    <button class="absolute top-4 right-4 bg-[#2E3548] px-3 py-1.5 rounded-lg">
      <BaseTypography class="text-xs font-medium text-white">정보 수정</BaseTypography>
    </button>

    <!-- 사용자 정보 -->
    <div class="flex items-center gap-3">
      <!-- 프로필 원형 아이콘 -->
      <div class="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
        <BaseTypography class="text-xs font-medium text-black">오</BaseTypography>
      </div>

      <div class="flex flex-col justify-center leading-tight">
        <!-- 이름 제거, 이메일만 -->
        <BaseTypography class="text-sm font-medium text-white">Ice001105@gmail.com</BaseTypography>
      </div>
    </div>

    <!-- 보유 포인트 -->
    <div class="flex justify-between items-center pt-1">
      <BaseTypography class="text-[14px] font-bold text-white">보유 포인트</BaseTypography>
      <BaseTypography class="text-[18px] font-extrabold tracking-tight text-white"
        >60,000원</BaseTypography
      >
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
</script>

<style scoped></style>
