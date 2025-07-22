<template>
  <div class="space-y-4">
    <AdminListItemCard
      v-for="item in filtered"
      :key="item.id"
      v-bind="item"
      @approve="$emit('approve', item.id)"
      @reject="$emit('reject', item.id)"
    />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import AdminListItemCard from './AdminListItemCard.vue'
const props = defineProps({
  list: Array,
})

const filtered = computed(() => props.list.filter((p) => p.status === '대기'))
</script>
