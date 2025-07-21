<template>
  <BaseCard class="h-26 flex justify-between items-center px-6 mb-4">
    <BaseTypography class="text-left leading-tight">
      지금 바로 반의반집의 다양한<br />
      <span class="bg-yellow-200 rounded px-1">투자 매물</span>을 탐색해보세요!
    </BaseTypography>

    <button
      class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
      @click="goToFundingList"
      aria-label="투자매물 탐색하기"
    >
      <span class="material-symbols-outlined text-2xl">chevron_right</span>
    </button>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const emit = defineEmits(['view-funding-list'])

const goToFundingList = () => {
  emit('view-funding-list')
}
</script>
