<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    authStore.loadUserInfo()
  } else {
    // 토큰이 없으면 authStore의 상태를 확실하게 로그아웃 처리합니다.
    authStore.logout()
  }
})
</script>

<template>
  <div class="relative min-h-screen">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <RouterView />
    </div>
  </div>
</template>
