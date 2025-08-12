<script setup>
import { useNotificationStore } from '@/stores/notification'

const nStore = useNotificationStore()

defineProps({ n: Object })

const hhmm = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>
<template>
  <article class="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 relative">
    <time class="absolute right-3 top-2 text-[11px] text-gray-400">
      {{ hhmm(n.createdAt) }}
    </time>

    <div class="pr-16">
      <p
        class="text-[13px] font-semibold leading-snug"
        :class="n.isRead ? 'text-gray-400' : 'text-gray-900'"
      >
        {{ n.title }}
      </p>
      <p class="mt-2 text-[13px] text-gray-800 leading-snug whitespace-pre-line">
        {{ n.body }}
      </p>

      <div class="mt-2" v-if="!n.isRead">
        <button
          class="text-xs px-2 py-1 rounded bg-blue-500 text-white"
          @click="nStore.readOne(n.notificationId)"
        >
          읽음 처리
        </button>
      </div>
    </div>

    <span
      class="absolute left-3 top-3 w-2 h-2 rounded-full"
      :class="n.isRead ? 'bg-gray-300' : 'bg-blue-500'"
      title="읽음 상태"
    />
  </article>
</template>
