<template>
  <button :class="buttonClass">
    <slot>Button</slot>
  </button>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})

const buttonClass = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-md cursor-pointer mr-2.5 transition-colors'

  const variantClasses = {
    primary: 'bg-blue-500 text-white border-none hover:bg-blue-600',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    pill: 'bg-emerald-500 text-white rounded-full border-none hover:bg-emerald-600',
  }

  return `${baseClasses} ${variantClasses[props.variant] || variantClasses.primary}`
})
</script>
