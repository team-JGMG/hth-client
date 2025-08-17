<template>
  <div class="flex bg-gray-100 rounded-lg p-1 space-x-1">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      :class="[
        'flex-1 py-1 px-2 rounded-md text-sm font-medium text-gray-600',
        'hover:bg-white focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap',
        { 'bg-white text-gray-900': tab.value === modelValue },
        'flex items-center justify-center',
      ]"
      @click="selectTab(tab.value)"
    >
      <BaseTypography class="text-sm font-medium"> {{ tab.label }}</BaseTypography>
    </button>
  </div>
</template>

<script setup>
import BaseTypography from '../Typography/BaseTypography.vue'

defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) =>
      value.every((tab) => typeof tab.label === 'string' && typeof tab.value === 'string'),
  },
  modelValue: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectTab = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped></style>
