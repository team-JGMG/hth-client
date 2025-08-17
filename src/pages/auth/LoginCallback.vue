<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseLayout from '@/layouts/BaseLayout.vue'
import SkeletonLoader from '@/components/common/Skeleton/SkeletonLoader.vue'

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
  <BaseLayout>
    <SkeletonLoader />
  </BaseLayout>
</template>

<style scoped>
</style>