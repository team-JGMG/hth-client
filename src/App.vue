<template>
  <div class="relative min-h-screen">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <RouterView />
    </div>
    <BaseToast />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useFcmStore } from '@/stores/fcm' // 🔹 FCM 스토어 import
import BaseToast from './components/BaseToast.vue'

const authStore = useAuthStore()
const fcmStore = useFcmStore()
const fcmInitializing = ref(false)

onMounted(async () => {
  // 로그인 상태 복구
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    await authStore.loadUserInfo()
  } else {
    // 토큰이 없으면 authStore의 상태를 확실하게 로그아웃 처리합니다.
    authStore.logout()
  }

  // FCM 초기화
  try {
    fcmInitializing.value = true
    await fcmStore.init()
  } catch (err) {
    console.error('❌ FCM 초기화 실패:', err)
  } finally {
    fcmInitializing.value = false
  }
})
</script>
