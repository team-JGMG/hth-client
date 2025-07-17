<template>
  <div
    class="flex bg-gray-100 rounded-lg p-1 space-x-1"
    :style="{ width: '345px', height: '37px' }"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      :class="[
        'flex-1 py-1 px-2 rounded-md text-sm font-medium text-gray-600', // py-2 -> py-1, px-3 -> px-2로 패딩 축소
        'hover:bg-white focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap',
        { 'bg-white text-gray-900': tab.value === modelValue }, // 'shadow' 클래스 제거
        'flex items-center justify-center',
      ]"
      @click="selectTab(tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

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
