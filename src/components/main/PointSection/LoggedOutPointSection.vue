<template>
  <div>
    <BaseTypography class="text-xl mb-1" color="white">???님,</BaseTypography>
    <div class="flex items-baseline justify-between mb-4">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">???원</BaseTypography>
    </div>
    <BaseTypography class="text-sm mb-4 text-center break-keep" :style="{ color: '#F4EAB2' }">
      소액으로도 안전하게, 부동산 투자의 첫 걸음 <br />반의반집 포인트로 당신의 소중한 투자를
      시작하고 관리하세요.
    </BaseTypography>
    <button
      @click="goToLogin"
      aria-label="로그인하고 투자 자산 확인하기"
      class="flex items-center justify-between w-full p-0 border-none bg-transparent cursor-pointer"
      style="height: 100%"
    >
      <BaseCard class="h-6 flex justify-between items-center px-6">
        <BaseTypography class="font-medium" weight="medium"
          >로그인하고 투자 자산 확인하기</BaseTypography
        >
        <div
          class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </div>
      </BaseCard>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/auth/login')
}
</script>
