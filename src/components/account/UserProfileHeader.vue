<script setup>
const isChargeModalOpen = ref(false)
const isWithdrawModalOpen = ref(false)

const handleCharge = (amount) => {
  console.log('충전 금액:', amount)
  isChargeModalOpen.value = false
}
const handleWithdraw = (amount) => {
  console.log('환급 금액:', amount)
  isWithdrawModalOpen.value = false
}
import { ref } from 'vue'
import PointChargeModal from '@/components/account/PointChargeModal.vue'
import PointChangeModal from '@/components/account/PointChangeModal.vue'
</script>

<template>
  <div class="relative bg-black rounded-xl px-5 pt-5 pb-5 text-white">
    <!-- 정보 수정 버튼 -->
    <button class="absolute top-4 right-4 bg-[#2E3548] px-4 py-2 rounded-md">
      <BaseTypography class="text-sm font-semibold !text-white">정보 수정</BaseTypography>
    </button>

    <!-- 사용자 정보 -->
    <div class="flex items-center mb-4">
      <!-- 프로필 아이콘 -->
      <div class="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
        <BaseTypography class="text-sm font-semibold text-black">오</BaseTypography>
      </div>
      <!-- 이름 + 이메일 -->
      <div class="ml-3">
        <BaseTypography class="text-lg font-extrabold !text-white">이채빵</BaseTypography>
        <BaseTypography class="text-sm !text-white">Ice001105@gmail.com</BaseTypography>
      </div>
    </div>

    <!-- 보유 포인트 -->
    <div class="flex justify-between items-center">
      <BaseTypography class="text-base font-bold !text-white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-extrabold tracking-tight !text-white">
        60,000원
      </BaseTypography>
    </div>
  </div>
</template>
