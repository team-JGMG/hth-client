<template>
  <div class="flex justify-center mb-4 space-x-2">
    <div
      v-for="n in totalSteps"
      :key="n"
      :class="['w-2 h-2 rounded-full', n === currentStep ? 'bg-black' : 'bg-gray-300']"
    />
  </div>
</template>

<script setup>
defineProps({
  currentStep: Number,
  totalSteps: Number,
})
</script>
