<!-- components/account/LogoutButton.vue -->
<template>
  <button
    @click="handleLogout"
    class="w-full flex items-center gap-2 border border-gray-300 text-black text-sm px-4 rounded-lg hover:bg-gray-100 transition min-h-[56px]"
  >
    <img src="@/assets/images/Logout.png" alt="로그아웃" class="w-5 h-5" />
    <span class="font-medium">로그아웃</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout as logoutAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    // ✅ 백엔드에 로그아웃 요청
    await logoutAPI()

    // ✅ Pinia 스토어 초기화
    authStore.logout()

    // ✅ 로그인 페이지로 이동
    router.push('/auth/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
    alert('로그아웃에 실패했습니다. 다시 시도해 주세요.')
  }
}
</script>
