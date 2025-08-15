<script setup>
import { useNotificationStore } from '@/stores/notification'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const nStore = useNotificationStore()
</script>

<template>
  <div class="flex items-center justify-end gap-3 px-2 mb-2">
    <div class="flex gap-2">
      <button
        class="group relative px-2 py-1.5 text-sm font-medium flex items-center gap-1.5 rounded-lg"
        :class="[
          nStore.hasUnread
            ? 'bg-black text-white'
            : 'bg-gray-300 text-gray-100 cursor-not-allowed opacity-50',
        ]"
        @click="nStore.readAll"
        :disabled="!nStore.hasUnread"
      >
        <span class="flex items-center gap-1.5"
          ><BaseTypography size="sm" color="gray-5">
            안 읽은 알림 {{ nStore.unreadCount }}개
          </BaseTypography>
          <span class="material-symbols-outlined" style="font-size: 14px">check</span>
        </span>
      </button>
    </div>
  </div>
</template>
