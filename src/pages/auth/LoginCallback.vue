//LoginCallback.vue

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { fetchUserInfo } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const preauthToken = route.query.preauthToken // ✅ 쿼리에서 먼저 받음
const status = route.query.status
const email = route.query.email

const handleCallback = async () => {
  if (status === 'SUCCESS') {
    try {
      const res = await fetchUserInfo()
      authStore.setUserInfo(res.data)
      authStore.setLoggedIn(true)
      router.push('/') // 메인 페이지
    } catch (err) {
      console.error('유저 정보 요청 실패:', err)
      router.push('/auth/login?error=1')
    }
  } else if (status === 'SIGNUP_REQUIRED') {
    router.push({
      path: '/auth/signup',
      query: { email, preauthToken }, // 쿼리로 이메일 전달
    })
  } else {
    router.push('/auth/login?error=1') // 예외 처리
  }
}

handleCallback()
</script>

<template>
  <div>로그인 처리 중입니다...</div>
</template>
