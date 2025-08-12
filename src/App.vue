<template>
  <div class="relative min-h-screen">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <RouterView />
    </div>
    <BaseToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notification'
import BaseToast from './components/BaseToast.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
  console.log('[APP] bootstrap')
  await authStore.loadUserInfo()

  if (authStore.getIsLoggedIn) {
    notificationStore.fetch()
    try {
      const { getPointBalance } = await import('@/api/point')
      const point = await getPointBalance(authStore.userId)
      authStore.setUserPoint(point)
    } catch (e) {
      console.warn('[Point] 포인트 조회 실패:', e)
    }
  } else {
    console.log('[APP] not logged in')
  }
})
</script>
