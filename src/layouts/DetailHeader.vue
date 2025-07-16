<template>
  <div class="bg-blue-50">
    <header class="py-5 px-4">
      <button class="w-6 h-6 flex justify-center items-center text-black" @click="onBack">
        <i class="fa-solid fa-arrow-left-long"></i>
      </button>
    </header>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  onBack: {
    type: Function,
    default: () => {},
    validator: (value) => {
      return typeof value === 'function'
    },
  },
})
</script>
