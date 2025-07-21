<template>
  <button @click="fundingListPage" aria-label="투자매물 탐색하기" class="w-full">
    <BaseCard class="h-26 flex justify-between items-center px-6 mb-4">
      <BaseTypography class="text-left" weight="bold">
        지금 바로 반의반집의<br /><span class="bg-yellow-200 rounded px-1">다양한 투자 매물</span>을
        탐색해보세요!
      </BaseTypography>

      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>
  </button>
</template>
<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
const router = useRouter()

const fundingListPage = () => {
  router.push('/funding/list')
}
</script>
