<template>
  <div class="min-h-screen bg-gray-100">
    <main class="p-6 max-w-md mx-auto min-h-screen bg-white text-black relative">
      <CommonHeader />
      <slot></slot>
      <CommonNav />
    </main>
  </div>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
import CommonNav from './CommonNav.vue'
</script>
