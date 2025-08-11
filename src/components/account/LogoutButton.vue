<!-- components/account/LogoutButton.vue -->
<template>
  <button
    @click="handleLogout"
    class="w-full flex items-center gap-3 border border-gray-300 text-black text-sm px-4 rounded-lg transition min-h-[56px]"
  >
    <span class="material-symbols-outlined"> chip_extraction </span>
    <BaseTypography size="sm" weight="bold">로그아웃</BaseTypography>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout as logoutAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const handleLogout = async () => {
  try {
    // ✅ 백엔드에 로그아웃 요청
    await logoutAPI()

    // ✅ Pinia 스토어 초기화
    authStore.logout()

    // ✅ 로그인 페이지로 이동
    toast.show('로그인 후 이용 가능합니다.')
    router.push('/auth/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
    toast.error('로그아웃에 실패했습니다. 다시 시도해 주세요.')
  }
}
</script>
