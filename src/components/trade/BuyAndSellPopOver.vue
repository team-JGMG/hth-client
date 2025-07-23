<template>
  <div class="bg-black rounded-lg overflow-hidden mb-4">
    <div
      class="p-4 cursor-pointer flex justify-between items-center w-full bg-[#1a1a1a]"
      @click="toggleOpen"
    >
      <span class="text-white text-base font-bold">
        <span class="text-red-500">구매할래요</span> 판매할래요
      </span>
      <span
        class="material-symbols-outlined text-white transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        expand_less
      </span>
    </div>

    <div v-if="isOpen" class="p-4 bg-black text-white">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  transform: rotate(0deg);
}
.material-symbols-outlined.rotate-180 {
  transform: rotate(180deg);
}
</style>
