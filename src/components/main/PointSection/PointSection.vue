<template>
  <div class="mb-4">
    <div class="bg-black rounded-2xl p-6 text-white">
      <template v-if="authStore.getIsLoggedIn">
        <LoggedInPointSection />
      </template>
      <template v-else>
        <LoggedOutPointSection />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import LoggedInPointSection from './LoggedInPointSection.vue'
import LoggedOutPointSection from './LoggedOutPointSection.vue'

const authStore = useAuthStore()

onMounted(() => {
  // 테스트용 자동 로그인
  authStore.login()
})
</script>
