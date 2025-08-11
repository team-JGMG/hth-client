<template>
  <DetailLayout>
    <DetailHeader>알림</DetailHeader>

    <NotificationControls />

    <NotificationLoading v-if="nStore.loading" />
    <NotificationError v-else-if="nStore.error" :error="nStore.error" />
    <template v-else>
      <NotificationList v-if="nStore.items.length" :grouped="grouped" />
      <NotificationEmpty v-else />
    </template>
  </DetailLayout>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationControls from '@/components/notification/NotificationControls.vue'
import NotificationList from '@/components/notification/NotificationList.vue'
import NotificationEmpty from '@/components/notification/NotificationEmpty.vue'
import NotificationLoading from '@/components/notification/NotificationLoading.vue'
import NotificationError from '@/components/notification/NotificationError.vue'

const nStore = useNotificationStore()

onMounted(() => nStore.fetch())

const yyyymmddDot = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}.`
}

const grouped = computed(() =>
  nStore.items
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .reduce((acc, n) => {
      const key = yyyymmddDot(n.createdAt)
      ;(acc[key] ||= []).push(n)
      return acc
    }, {}),
)
</script>
