<template>
  <section
    class="bg-white rounded-xl w-full flex flex-col p-6 border"
    style="border-color: #d9d9d9"
  >
    <div class="flex items-center justify-between mb-4">
      <BaseTypography class="text-black font-bold text-base">
        {{ title }}
      </BaseTypography>
    </div>

    <slot></slot>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import BaseTypography from '../Typography/BaseTypography.vue'

defineProps({
  title: {
    type: String,
    default: null,
  },
  toName: {
    type: String,
    default: null,
  },
  query: {
    type: Object,
    default: null,
  },
})
</script>
