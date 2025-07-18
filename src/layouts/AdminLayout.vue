<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <main class="py-6 px-6 w-full max-w-[393px] min-h-screen bg-white text-black relative">
      <CommonHeader />
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
</script>
