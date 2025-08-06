<!-- components/account/DeleteAccountButton.vue -->
<template>
  <button
    type="button"
    @click="handleDeleteAccount"
    class="w-full border border-red-500 bg-white text-red-500 px-4 rounded-lg flex items-center gap-3 mt-2 min-h-[56px] hover:bg-red-50 transition"
  >
    <span class="material-symbols-outlined"> person_cancel </span>
    <div class="flex flex-col justify-center text-left">
      <BaseTypography color="red" size="sm" weight="bold">회원 탈퇴</BaseTypography>
      <BaseTypography color="red" size="xs">계정을 영구적으로 삭제합니다.</BaseTypography>
    </div>
  </button>
</template>

<script setup>
import BaseTypography from '../common/Typography/BaseTypography.vue'

// TODO: 실제 탈퇴 처리 로직 연결
const handleDeleteAccount = () => {
  if (confirm('정말로 회원 탈퇴하시겠습니까?')) {
    console.log('💀 회원 탈퇴 로직 실행') // 실제 API 연결 필요
  }
}
</script>
