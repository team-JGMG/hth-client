<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <CommonHeader />
    <slot></slot>
  </main>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
</script>
