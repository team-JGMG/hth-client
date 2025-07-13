<template>
  <main class="max-w-3xl min-h-screen p-0 relative bg-gray-100 mx-auto flex flex-col">
    <CommonHeader />
    <div class="flex-grow"><slot></slot></div>
    <CommonNavbar />
  </main>
</template>
<script setup>
import CommonHeader from '@/components/layouts/CommonHeader.vue'
import CommonNavbar from '@/components/layouts/CommonNavbar.vue'
</script>
