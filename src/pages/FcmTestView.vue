<template>
  <div class="p-6 space-y-6">
    <!-- FCM Push Test -->
    <section class="space-y-4">
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
          {{
            fcm.token ? '토큰 발급 완료' : initializing ? '초기화 중...' : 'FCM 초기화/토큰 발급'
          }}
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
    </section>

    <hr class="border-gray-200" />

    <!-- Notifications List -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">🔔 알림</h2>
        <div class="flex items-center gap-2">
          <span v-if="nStore.hasUnread" class="text-sm text-gray-500"
            >안 읽음 {{ nStore.unreadCount }}개</span
          >
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            @click="nStore.readAll"
            :disabled="!nStore.hasUnread"
          >
            전체 읽음
          </button>
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            @click="nStore.fetch"
            :disabled="nStore.loading"
            title="새로고침"
          >
            새로고침
          </button>
        </div>
      </div>

      <div v-if="nStore.loading">불러오는 중…</div>
      <div v-else-if="nStore.error" class="text-red-500">{{ nStore.error }}</div>

      <ul v-else class="divide-y rounded border">
        <li
          v-for="n in nStore.items"
          :key="n.notificationId"
          class="p-3 flex items-start gap-3 hover:bg-gray-50"
        >
          <span
            class="mt-2 w-2 h-2 rounded-full flex-shrink-0"
            :class="n.read ? 'bg-gray-300' : 'bg-blue-500'"
            title="읽음 상태"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="font-medium" :class="n.read ? 'text-gray-500' : 'text-gray-900'">
                {{ n.title }}
              </h3>
              <time class="text-xs text-gray-400">{{ formatTime(n.createdAt) }}</time>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ n.body }}</p>
            <div class="mt-2">
              <button
                v-if="!n.read"
                class="text-xs px-2 py-1 rounded bg-blue-500 text-white"
                @click="nStore.readOne(n.notificationId)"
              >
                읽음 처리
              </button>
            </div>
          </div>
        </li>

        <li v-if="!nStore.items.length" class="p-6 text-center text-gray-500">알림이 없습니다.</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFcmStore } from '@/stores/fcm'
import { useNotificationStore } from '@/stores/notification'

const fcm = useFcmStore()
const nStore = useNotificationStore()
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

onMounted(() => {
  // 화면 진입 시 알림 목록 가져오기
  nStore.fetch()
})

// 간단한 시간 포맷터
const formatTime = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>
