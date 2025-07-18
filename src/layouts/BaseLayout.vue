<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <CommonHeader />
    <slot></slot>
    <CommonNav />
  </main>
</template>
<script setup>
import CommonHeader from './CommonHeader.vue'
import CommonNav from './CommonNav.vue'
</script>
<style scoped></style>
