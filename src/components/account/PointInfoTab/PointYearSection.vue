<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import PointLogItem from './PointLogItem.vue'

defineProps({
  year: { type: [String, Number], required: true },
  logs: { type: Array, required: true },
})
</script>

<template>
  <div class="space-y-2">
    <BaseTypography class="text-sm text-gray-500">{{ year }}년</BaseTypography>

    <PointLogItem v-for="(log, idx) in logs" :key="log.id ?? idx" :log="log" :index="idx" />
  </div>
</template>
