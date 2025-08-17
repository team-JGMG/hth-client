<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const status = route.query.status
const email = route.query.email
const handleCallback = async () => {
  if (status === 'ADMIN') {
    router.push('/admin/property-review')
  } else if (status === 'SUCCESS') {
    try {
      await authStore.loadUserInfo()

      await nextTick()
      router.push('/')
    } catch {
      router.push('/auth/login?error=user_fetch_failed')
    }
  } else if (status === 'SIGNUP_REQUIRED') {
    document.cookie = 'accessToken=; Max-Age=0; path=/'

    router.push({
      path: '/auth/signup',
      query: {
        email: email || '',
      },
    })
  } else {
    router.push('/auth/login?error=invalid_status')
  }
}

onMounted(() => {
  handleCallback()
})
</script>

<template>
  <div class="text-center mt-20 text-lg text-gray-600">로그인 처리 중입니다...</div>
</template>
