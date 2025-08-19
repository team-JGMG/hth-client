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
    <BaseTypography size="bold" weight="bold" class="mb-3 px-1 mt-4">{{ year }}년</BaseTypography>

    <PointLogItem v-for="(log, idx) in logs" :key="log.id ?? idx" :log="log" :index="idx" />
  </div>
</template>
