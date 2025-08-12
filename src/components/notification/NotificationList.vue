<script setup>
import BaseTypography from '../common/Typography/BaseTypography.vue'
import NotificationListItem from './NotificationListItem.vue'

defineProps({ grouped: Object })
</script>

<template>
  <div v-for="(list, date) in grouped" :key="date">
    <BaseTypography size="bold" class="mb-3 px-1 mt-4">{{ date }}</BaseTypography>

    <div class="space-y-2">
      <NotificationListItem v-for="n in list" :key="n.notificationId" :n="n" />
    </div>
  </div>
</template>
