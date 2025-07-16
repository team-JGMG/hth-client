<template>
  <div class="min-h-screen bg-black">
    <CommonHeader />

    <main class="p-6 max-w-md mx-auto min-h-screen bg-white text-black relative">
      <slot></slot>
    </main>
    <CommonNav />
  </div>
</template>

<script setup>
import CommonHeader from './CommonHeader.vue'
import CommonNav from './CommonNav.vue'

console.log('BaseLayout 로드됨')
</script>
