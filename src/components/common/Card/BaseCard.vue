<template>
  <section class="bg-white rounded-2xl w-full flex flex-col p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-gray-600 font-bold text-base">
        {{ title }}
      </h3>
      <router-link
        v-if="toName"
        :to="{ name: toName, query: query }"
        class="text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </router-link>
    </div>

    <slot></slot>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

// Chevron Right Icon Component
const ChevronRightIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `,
}

defineProps({
  /**
   * @type {string}
   * @description 카드 제목
   */
  title: {
    type: String,
    default: null,
  },
  /**
   * @type {string}
   * @description 이동할 페이지의 name 항목.
   */
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
