<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="relative flex justify-center items-center h-screen bg-white">
    <div class="absolute top-48 text-center">
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
    </div>

    <div class="absolute right-10 rotate-90">
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
    </div>

    <div class="absolute left-10 -rotate-90">
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
    </div>

    <div class="absolute bottom-48 rotate-180 text-center">
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
      <BaseTypography class="text-xl font-bold text-black">404 error..</BaseTypography>
    </div>

    <RouterLink to="/">
      <img
        src="@/assets/images/character/sadHOMEch.png"
        alt="404 아이콘"
        class="w-40 hover:opacity-80 transition"
      />
    </RouterLink>
  </div>
</template>
