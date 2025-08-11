<template>
  <header
    class="bg-white h-24 max-w-md mx-auto fixed top-0 left-0 right-0 z-50 py-6 flex items-center justify-between px-6"
  >
    <BaseLogo />

    <div class="relative cursor-pointer" @click="goFcmTest">
      <img src="@/assets/images/alert/alert.png" alt="알림" class="w-8 h-8 object-contain" />
      <!-- 빨간 점 (통통 튀는 애니메이션, 더 붙임) -->
      <span
        v-if="nStore.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-bounce"
      ></span>
    </div>
  </header>
  <div class="h-20"></div>
</template>

<script setup>
import BaseLogo from '@/components/common/Logo/BaseLogo.vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const nStore = useNotificationStore()
const authStore = useAuthStore()
const toast = useToastStore()

const goFcmTest = () => {
  if (!authStore.getIsLoggedIn) {
    toast.show('로그인 후 이용 가능합니다.')
    router.push('/auth/login')
    return
  }
  router.push('/fcm-test')
}
</script>
