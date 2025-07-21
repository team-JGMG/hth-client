<template>
  <section
    class="bg-white rounded-xl w-full flex **flex-row** p-6 border"
    style="border-color: #d9d9d9"
  >
    <slot></slot>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

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
