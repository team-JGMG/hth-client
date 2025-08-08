<template>
  <button
    @click="goToMyPage"
    aria-label="포인트 관리하러 가기"
    class="flex items-center justify-between w-full p-0 border-none bg-transparent cursor-pointer"
    style="height: 100%"
  >
    <BaseCard class="h-6 flex justify-between items-center px-6">
      <BaseTypography class="text-black font-bold">포인트 관리하러 가기</BaseTypography>
      <div
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </div>
    </BaseCard>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
const router = useRouter()
const goToMyPage = () => router.push('/account/my-page/points')
</script>
