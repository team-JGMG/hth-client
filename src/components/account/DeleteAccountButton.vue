<template>
  <button
    type="button"
    @click="handleLogout"
    class="w-full border border-red-500 bg-white text-red-500 px-4 rounded-lg flex items-center gap-3 mt-2 min-h-[56px] hover:bg-red-50 transition"
  >
    <span class="material-symbols-outlined"> person_cancel </span>
    <div class="flex flex-col justify-center text-left">
      <BaseTypography color="red" size="sm" weight="bold">회원 탈퇴</BaseTypography>
      <BaseTypography color="red" size="xs">계정을 영구적으로 삭제합니다.</BaseTypography>
    </div>
  </button>
</template>
<script setup>
import BaseTypography from '../common/Typography/BaseTypography.vue'
import { useRouter } from 'vue-router'
import { logout as logoutAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { useFcmStore } from '@/stores/fcm'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()
const fcmStore = useFcmStore()

const handleLogout = async () => {
  try {
    await fcmStore.init()
    const deviceToken = fcmStore.token || null

    await logoutAPI(deviceToken)

    authStore.logout()

    toast.warn({ title: '탈퇴 완료', body: '이용해주셔서 감사합니다.' })
    router.push('/')
  } catch {
    toast.error({ title: '탈퇴 실패', body: '탈퇴 오류가 발생했습니다. 다시 시도해 주세요.' })
  }
}
</script>
