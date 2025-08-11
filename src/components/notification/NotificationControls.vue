<script setup>
import { useNotificationStore } from '@/stores/notification'

const nStore = useNotificationStore()
</script>

<template>
  <div class="flex items-center justify-between px-2 mb-2">
    <div class="text-sm text-gray-500">안 읽음 {{ nStore.unreadCount }}개</div>
    <div class="flex gap-2">
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
      >
        새로고침
      </button>
    </div>
  </div>
</template>
