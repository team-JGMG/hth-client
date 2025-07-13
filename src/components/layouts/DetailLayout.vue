<template>
  <div class="max-w-3xl min-h-screen p-0 relative bg-gray-100 mx-auto">
    <DetailHeader :onBack="onBack">
      <slot name="header"></slot>
    </DetailHeader>

    <slot></slot>
  </div>
</template>

<script setup>
import DetailHeader from './DetailHeader.vue'

defineProps({
  onBack: {
    type: Function,
    default: () => {},
    validator: (value) => {
      return typeof value === 'function'
    },
  },
})
</script>
