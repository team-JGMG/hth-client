<!-- components/account/PointInfoTab/PointYearSection.vue -->
<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import PointLogItem from './PointLogItem.vue'

const props = defineProps({
  year: { type: [String, Number], required: true },
  logs: { type: Array, required: true },
})
</script>

<template>
  <div class="space-y-2">
    <!-- 연도 헤더 -->
    <BaseTypography class="text-sm text-gray-500">{{ year }}년</BaseTypography>

    <!-- 해당 연도의 로그들 -->
    <PointLogItem v-for="(log, idx) in logs" :key="log.id ?? idx" :log="log" :index="idx" />
  </div>
</template>
