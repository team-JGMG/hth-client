<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="flex justify-center mb-6">
      <BaseButton
        @click="goToPropertyRegisterPage"
        variant="secondary"
        class="relative flex items-center justify-center px-9 py-4 rounded-[15px] text-white text-lg leading-none bg-[#2e3548] hover:bg-[#1f2738]"
      >
        <!-- + 버튼: 왼쪽 정렬 + 중앙 정렬 -->
        <span class="absolute left-6 top-8/10 -translate-y-1/2 text-2xl">+</span>
        <span class="ml-6">매물 등록하기</span>
      </BaseButton>
    </div>
    <!-- 안내 카드 -->
    <div
      class="border rounded-xl p-6 bg-white text-center min-h-[500px] flex flex-col justify-center"
    >
      <img src="@/assets/images/logo.png" alt="logo" class="w-16 h-16 mx-auto mb-4" />
      <BaseTypography class="font-semibold mb-2">아직 판매 등록된 매물이 없네요.</BaseTypography>
      <BaseTypography class="text-sm text-gray-600">
        지금 바로 등록하고<br />새로운 투자 기회를 만들어보세요!
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

import BaseButton from '../common/Button/BaseButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToPropertyRegisterPage = () => {
  router.push('/property/register')
}
</script>
