<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <DetailHeader />
    <slot></slot>
  </main>
</template>

<script setup>
import DetailHeader from './DetailHeader.vue'
</script>
