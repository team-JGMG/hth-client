<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const nStore = useNotificationStore()
const props = defineProps({ n: { type: Object, required: true } })

const isUnread = computed(() => !props.n.isRead)

const hhmm = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

const handleClick = async () => {
  if (props.n.isRead) return
  await nStore.readOne(props.n.notificationId)
}
</script>

<template>
  <article
    class="rounded-2xl px-4 py-3 shadow-sm border relative transition-colors"
    :class="
      isUnread
        ? 'bg-blue-50 border-blue-100 hover:bg-blue-100 cursor-pointer'
        : 'bg-gray-50 border-gray-100 cursor-default'
    "
    @click="handleClick"
    @keydown.enter.space.prevent="handleClick"
    tabindex="0"
    role="button"
  >
    <time class="absolute right-3 top-2">
      <BaseTypography size="xs" color="gray-2"> {{ hhmm(n.createdAt) }}</BaseTypography>
    </time>

    <div class="pr-16">
      <BaseTypography
        size="base"
        weight="bold"
        class="break-keep"
        :class="n.isRead ? 'text-gray-500' : 'text-gray-900'"
      >
        {{ n.title }}
      </BaseTypography>

      <BaseTypography
        size="sm"
        color="gray-1"
        class="mt-1 leading-snug whitespace-pre-line break-keep"
      >
        {{ n.body }}
      </BaseTypography>
    </div>
  </article>
</template>
