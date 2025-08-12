<script setup>
import { useNotificationStore } from '@/stores/notification'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const nStore = useNotificationStore()
</script>

<template>
  <div class="flex items-center justify-between px-2 mb-2">
    <BaseTypography size="sm" color="gray-1"
      >안 읽은 알림 {{ nStore.unreadCount }}개</BaseTypography
    >
    <div class="flex gap-2">
      <button
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        @click="nStore.readAll"
        :disabled="!nStore.hasUnread"
      >
        전체 읽음
      </button>
    </div>
  </div>
</template>
