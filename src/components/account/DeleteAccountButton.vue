<!-- components/account/DeleteAccountButton.vue -->
<template>
  <button
    type="button"
    @click="handleDeleteAccount"
    class="w-full border border-red-400 bg-white text-red-500 px-4 rounded-lg flex items-center gap-2 mt-3 min-h-[56px] hover:bg-red-50 transition"
  >
    <img src="@/assets/images/DeleteUser.png" alt="회원 탈퇴" class="w-5 h-5" />
    <div class="flex flex-col justify-center text-left">
      <div class="font-bold text-sm">회원 탈퇴</div>
      <div class="text-xs mt-0.5">계정을 영구적으로 삭제합니다.</div>
    </div>
  </button>
</template>

<script setup>
// TODO: 실제 탈퇴 처리 로직 연결
const handleDeleteAccount = () => {
  if (confirm('정말로 회원 탈퇴하시겠습니까?')) {
    console.log('💀 회원 탈퇴 로직 실행') // 실제 API 연결 필요
  }
}
</script>
