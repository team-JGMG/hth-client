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
import { useNotificationStore } from '@/stores/notification'
import BaseToast from './components/BaseToast.vue'

const authStore = useAuthStore()
const fcmStore = useFcmStore()
const notificationStore = useNotificationStore()
const fcmInitializing = ref(false)

onMounted(async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    await authStore.loadUserInfo()
    if (authStore.getIsLoggedIn) {
      notificationStore.fetch()
      const point = await getPointBalance(authStore.userId)
      authStore.setUserPoint(point)
    }
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
