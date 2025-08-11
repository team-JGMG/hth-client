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
import { useFcmStore } from '@/stores/fcm'
import BaseToast from './components/BaseToast.vue'

const authStore = useAuthStore()
const fcmStore = useFcmStore()
const fcmInitializing = ref(false)

onMounted(async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    await authStore.loadUserInfo()
  } else {
    authStore.logout()
  }

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
