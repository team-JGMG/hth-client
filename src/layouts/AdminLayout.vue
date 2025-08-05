<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <CommonHeader />

    <BaseButton
      class="absolute top-11 right-6 h-[28px] bg-gray-600 hover:bg-gray-700 text-[11px] text-white z-[100] flex items-center gap-1 rounded-md"
      @click="handleLogout"
    >
      <span class="material-symbols-outlined leading-none" style="font-size: 14px"> logout </span>
      <span class="leading-none">로그아웃</span>
    </BaseButton>

    <slot></slot>
  </main>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  window.location.href = '/auth/login'
}
</script>
