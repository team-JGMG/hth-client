<script setup>
defineProps({
  error: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <BaseTypography color="red" class="text-center py-4">{{ error }}</BaseTypography>
</template>
