<script setup>
import NotificationListItem from './NotificationListItem.vue'

defineProps({ grouped: Object })
</script>

<template>
  <section class="mt-2 space-y-8">
    <div v-for="(list, date) in grouped" :key="date" class="px-2">
      <h3 class="text-[15px] font-semibold text-gray-600 mb-3 px-1">{{ date }}</h3>

      <div class="space-y-3">
        <NotificationListItem v-for="n in list" :key="n.notificationId" :n="n" />
      </div>
    </div>
  </section>
</template>
