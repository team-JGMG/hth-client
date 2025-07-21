<template>
  <div
    class="relative min-w-[160px] flex-shrink-0 rounded-xl overflow-hidden h-[160px]"
    :style="{
      backgroundImage: `url(${property.thumbnail_url || 'https://placehold.co/160x160/cccccc/ffffff?text=No+Image'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-4 text-white"
    >
      <BaseTypography class="text-center text-sm leading-tight" weight="semibold" color="white">
        누적 수익률 <br />
        <span class="text-2xl">{{
          property.yield_rate ? `+${property.yield_rate}%` : '정보 없음'
        }}</span>
      </BaseTypography>
      <p class="text-sm mt-1">{{ property.title }}</p>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue' // BaseTypography 경로 확인

defineProps({
  property: {
    type: Object,
    required: true,
  },
})
</script>
