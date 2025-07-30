<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>

    <div class="relative" @click="openSelect">
      <select
        ref="selectRef"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full border px-4 py-2 rounded appearance-none text-sm focus:outline-none',
          modelValue === '' ? 'text-gray-400' : 'text-black',
        ]"
      >
        <option value="" disabled hidden>{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>

      <span
        class="absolute right-3 top-2.5 text-black material-symbols-outlined pointer-events-none"
      >
        expand_more
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectRef = ref(null)

// focus + click으로 select 열기
const openSelect = () => {
  selectRef.value?.focus()
  selectRef.value?.click()
}

defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  options: Array,
})

defineEmits(['update:modelValue'])
</script>
