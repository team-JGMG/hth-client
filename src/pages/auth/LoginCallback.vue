<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const status = route.query.status

  if (status === 'PRE_AUTH') {
    // 회원가입이 필요한 신규 사용자
    router.push('/auth/signup')
  } else if (status === 'SUCCESS') {
    // 기존 사용자, 백엔드에서 토큰 쿠키로 내려줬다고 가정
    router.push('/')
  } else {
    // 예외 처리 (예: 로그인 실패)
    router.push('/auth/login?error=1')
  }
})
</script>
<template>
  <div class="p-6 text-center">로그인 처리 중...</div>
</template>
