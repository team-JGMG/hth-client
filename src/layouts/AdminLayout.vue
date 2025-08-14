<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <CommonHeader />

    <BaseButton
      class="absolute top-11 right-6 h-[28px] bg-gray-600 hover:bg-gray-700 text-[11px] text-white z-[100] flex items-center gap-1 rounded-md"
      @click="handleLogout"
    >
      <span class="material-symbols-outlined leading-none" style="font-size: 14px"> logout </span>
      <span class="leading-none">로그아웃</span>
    </BaseButton>

    <slot></slot>
  </main>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { logout as logoutRequest } from '@/api/auth' // 서버 로그아웃 API
import { useFcmStore } from '@/stores/fcm'
import { useToastStore } from '@/stores/toast'

const fcmStore = useFcmStore()
const authStore = useAuthStore()
const toast = useToastStore()
const handleLogout = async () => {
  try {
    console.log('[로그아웃 시작]')
    await fcmStore.init()
    const deviceToken = fcmStore.token || null

    await logoutRequest(deviceToken) // 서버에 로그아웃 요청 (쿠키 삭제 및 DB 정리)
    authStore.logout() // 클라이언트에서 로컬스토리지 정리
    toast.success('로그아웃 성공')
    console.log('[로그아웃 완료]')
    window.location.href = '/auth/login'
  } catch {
    toast.error({
      title: '로그아웃 실패',
      body: '로그아웃 중 오류가 발생했습니다.',
    })
  }
}
</script>
