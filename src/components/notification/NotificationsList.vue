<template>
  <div class="p-4 space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">🔔 알림</h1>
      <div class="flex items-center gap-2">
        <span v-if="store.hasUnread" class="text-sm text-gray-500"
          >안 읽음 {{ store.unreadCount }}개</span
        >
        <button
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          @click="store.readAll"
          :disabled="!store.hasUnread"
        >
          전체 읽음
        </button>
      </div>
    </div>

    <div v-if="store.loading">불러오는 중…</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <ul v-else class="divide-y rounded border">
      <li
        v-for="n in store.items"
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
              @click="store.readOne(n.notificationId)"
            >
              읽음 처리
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()

onMounted(() => {
  store.fetch()
})

const formatTime = (iso) => {
  // YYYY-MM-DD HH:mm 형식 간단 포맷
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n) => String(n).padStart(2, '0')
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${y}-${m}-${day} ${hh}:${mm}`
}
</script>
