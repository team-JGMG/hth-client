<template>
  <div class="space-y-4">
    <AdminListItemCard
      v-for="item in props.list"
      :key="item.propertyId"
      :propertyId="item.propertyId"
      :address="item.address"
      :postingPeriod="item.postingPeriod"
      :price="item.price"
      :status="item.status"
      :image="item.thumbnail?.photoUrl"
      :title="item.title"
      category="approved"
    />
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import AdminListItemCard from './AdminListItemCard.vue'

const props = defineProps({ list: Array })
</script>
