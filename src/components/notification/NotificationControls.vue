<script setup>
import { useNotificationStore } from '@/stores/notification'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const nStore = useNotificationStore()
</script>

<template>
  <div class="flex items-center justify-between px-2 mb-2">
    <BaseTypography size="sm" color="gray-1">
      안 읽은 알림 {{ nStore.unreadCount }}개
    </BaseTypography>
    <div class="flex gap-2">
      <button
        class="group relative px-4 py-1.5 rounded-full text-sm font-medium"
        :class="[
          nStore.hasUnread
            ? 'bg-blue-500 from-blue-500 text-white '
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50',
        ]"
        @click="nStore.readAll"
        :disabled="!nStore.hasUnread"
      >
        <span class="relative z-10 flex items-center gap-1.5"
          ><span class="material-symbols-outlined" style="font-size: 14px"> check </span>
        </span>
      </button>
    </div>
  </div>
</template>
