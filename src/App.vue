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
  // ✅ 토큰 여부와 무관하게 유저정보를 항상 요청
  await authStore.loadUserInfo()

  if (authStore.getIsLoggedIn) {
    // FCM 초기화는 authStore.loadUserInfo() 내부에서 이미 호출됨 (afterLogin)
    notificationStore.fetch()
    try {
      const { getPointBalance } = await import('@/api/auth')
      const point = await getPointBalance(authStore.userId)
      authStore.setUserPoint(point)
    } catch (e) {
      console.warn('[Point] 포인트 조회 실패:', e)
    }
  } else {
    // 세션 없음
    console.log('[APP] not logged in')
  }
})
</script>
