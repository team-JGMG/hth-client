<script setup>
defineProps({
  error: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-center text-red-500 py-4">{{ error }}</div>
</template>
