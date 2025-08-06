<!-- LoginCallback.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchUserInfo } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// ✅ status, email은 query에서 가져옴
const status = route.query.status
const email = route.query.email
const handleCallback = async () => {
  console.log('[소셜 로그인 콜백 시작]')
  console.log('status:', status)
  console.log('email:', email)

  if (status === 'SUCCESS') {
    try {
      const res = await fetchUserInfo() // ✅ 서버가 쿠키로 유저 인증
      console.log('유저 정보:', res.data)

      authStore.setUserInfo(res.data)
      authStore.setLoggedIn(true)

      // ✅ 유저 status에 따라 라우팅 분기
      if (res.data.status === 'admin') {
        router.push('/admin/property-review')
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('[유저 정보 가져오기 실패]', err)
      router.push('/auth/login?error=user_fetch_failed')
    }
  } else if (status === 'SIGNUP_REQUIRED') {
    setTimeout(() => {
      router.push({
        path: '/auth/signup',
        query: {
          email: email || '',
        },
      })
    }, 500) // 0.5초 지연
  } else {
    console.warn('[잘못된 status]', status)
    router.push('/auth/login?error=invalid_status')
  }
}

// ✅ 마운트 시 바로 실행
onMounted(() => {
  handleCallback()
})
</script>

<template>
  <div class="text-center mt-20 text-lg text-gray-600">로그인 처리 중입니다...</div>
</template>
