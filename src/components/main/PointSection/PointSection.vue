<template>
  <div class="mb-4">
    <div class="bg-black rounded-2xl p-6 text-white">
      <template v-if="getIsLoggedIn">
        <LoggedInPointSection />
      </template>
      <template v-else>
        <LoggedOutPointSection />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import LoggedInPointSection from './LoggedInPointSection.vue'
import LoggedOutPointSection from './LoggedOutPointSection.vue'

const authStore = useAuthStore()
const { getIsLoggedIn } = storeToRefs(authStore) // ✅ computed 값 reactive하게 가져오기
</script>
