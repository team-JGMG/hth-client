<template>
  <main class="py-6 px-6 w-full bg-white text-black relative pb-24">
    <DetailHeader />
    <slot></slot>
    <CommonNav />
  </main>
</template>

<script setup>
import CommonNav from './CommonNav.vue'
import DetailHeader from './DetailHeader.vue'
</script>
