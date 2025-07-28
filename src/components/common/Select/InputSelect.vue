<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full border px-4 py-2 rounded appearance-none text-sm focus:outline-none focus:ring focus:ring-black/30"
      >
        <option value="" disabled hidden>{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
      <span class="absolute right-3 top-2.5 text-gray-400 material-symbols-outlined">
        expand_more
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  options: Array,
})

defineEmits(['update:modelValue'])
</script>
