<template>
  <div class="px-4 mt-6">
    <!-- 로그아웃 -->
    <button
      @click="goToLogin"
      class="w-full flex items-center gap-2 border border-gray-300 text-black text-sm px-4 rounded-lg hover:bg-gray-100 transition min-h-[56px]"
    >
      <img src="@/assets/images/Logout.png" alt="로그아웃" class="w-5 h-5" />
      <span class="font-medium">로그아웃</span>
    </button>

    <!-- 회원 탈퇴 -->
    <!-- 회원 탈퇴 -->
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

    <!-- 하단 여백 -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToLogin = () => {
  router.push('/auth/login')
}
</script>
