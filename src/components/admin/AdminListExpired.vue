<template>
  <div class="space-y-4">
    <AdminListItemCard
      v-for="item in filtered"
      :key="item.id"
      v-bind="item"
      @delete="$emit('delete', item.id)"
    />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import AdminListItemCard from './AdminListItemCard.vue'
const props = defineProps({ list: Array })
const filtered = computed(() => props.list.filter((p) => p.status === '만료됨'))
</script>
