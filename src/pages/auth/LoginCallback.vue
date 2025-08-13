<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

  if (status === 'ADMIN') {
    // ✅ 관리자일 경우 바로 관리자 페이지로 이동
    router.push('/admin/property-review')
  } else if (status === 'SUCCESS') {
    try {
      // ✅ 유저 정보 로드 (쿠키 기반 인증)
      await authStore.loadUserInfo()

      // ✅ 상태 반영 후 렌더링 대기 → 그다음 이동
      await nextTick()
      router.push('/')
    } catch (err) {
      console.error('[유저 정보 가져오기 실패]', err)
      router.push('/auth/login?error=user_fetch_failed')
    }
  } else if (status === 'SIGNUP_REQUIRED') {
    // ✅ accessToken 삭제 (회원가입은 preAuthToken만 남겨야 함)
    document.cookie = 'accessToken=; Max-Age=0; path=/'

    router.push({
      path: '/auth/signup',
      query: {
        email: email || '',
      },
    })
  } else {
    console.warn('[잘못된 status]', status)
    router.push('/auth/login?error=invalid_status')
  }
}

// ✅ 마운트 시 콜백 실행
onMounted(() => {
  handleCallback()
})
</script>

<template>
  <div class="text-center mt-20 text-lg text-gray-600">로그인 처리 중입니다...</div>
</template>
