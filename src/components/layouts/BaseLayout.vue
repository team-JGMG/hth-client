<template>
  <main class="max-w-3xl min-h-screen p-0 relative bg-gray-100 mx-auto">
    <CommonHeader />
    <slot></slot>
  </main>
</template>

<script setup>
import CommonHeader from '@/components/layouts/CommonHeader.vue'
</script>
