<template>
  <div class="space-y-4">
    <AdminListItemCard
      v-for="item in props.list"
      :key="item.id"
      v-bind="item"
      @approve="$emit('approve', item.id)"
      @reject="$emit('reject', item.id)"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import AdminListItemCard from './AdminListItemCard.vue'
const props = defineProps({
  list: Array,
})
</script>
