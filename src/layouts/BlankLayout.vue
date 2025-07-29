<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <slot></slot>
    <CommonNav v-if="showNav" />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CommonNav from './CommonNav.vue'

const route = useRoute()

const showNav = computed(() => !route.path.startsWith('/onboarding'))
</script>
