<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
    <FundingItemCard
      v-for="item in items"
      :key="item.fundingId"
      :item="item"
      :status="'펀딩 완료'"
    />
  </div>
</template>

<script setup>
import FundingItemCard from '@/components/funding/list/FundingListItemCard.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>
