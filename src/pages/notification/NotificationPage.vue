<template>
  <DetailLayout>
    <DetailHeader>알림</DetailHeader>
    <NotificationControls class="-mt-20" />
    <NotificationList v-if="nStore.items.length" :grouped="grouped" />
    <NotificationEmpty v-else />
  </DetailLayout>
</template>
<script setup>
import { computed } from 'vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationControls from '@/components/notification/NotificationControls.vue'
import NotificationList from '@/components/notification/NotificationList.vue'
import NotificationEmpty from '@/components/notification/NotificationEmpty.vue'

const nStore = useNotificationStore()

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
