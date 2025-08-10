<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-bold">📡 FCM Push Test</h1>

    <div>
      <p>지원 여부: {{ fcm.supported ? '✅ 지원' : '❌ 미지원' }}</p>
      <p>권한 상태: {{ fcm.permission }}</p>
    </div>

    <div>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        @click="initFcm"
        :disabled="initializing || fcm.token"
      >
        {{ fcm.token ? '토큰 발급 완료' : initializing ? '초기화 중...' : 'FCM 초기화/토큰 발급' }}
      </button>
    </div>

    <div v-if="fcm.token" class="bg-gray-100 p-3 rounded">
      <h2 class="font-semibold mb-1">Device Token</h2>
      <textarea readonly :value="fcm.token" rows="4" class="w-full p-2 text-sm border"></textarea>
    </div>

    <div v-if="fcm.lastMessage" class="bg-green-100 p-3 rounded">
      <h2 class="font-semibold mb-1">최근 수신 메시지</h2>
      <pre class="text-sm">{{ fcm.lastMessage }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFcmStore } from '@/stores/fcm'

const fcm = useFcmStore()
const initializing = ref(false)

const initFcm = async () => {
  try {
    initializing.value = true
    await fcm.init()
  } catch (e) {
    console.error(e)
  } finally {
    initializing.value = false
  }
}
</script>
