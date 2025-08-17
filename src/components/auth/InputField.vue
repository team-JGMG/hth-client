<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: { type: String, default: '' },
  modelValue: [String, Number, null],
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
</script>

<template>
  <div class="mb-5">
    <BaseTypography v-if="props.label" class="block text-base font-medium mb-1">
      {{ props.label }}
    </BaseTypography>

    <input
      v-bind="$attrs"
      :value="props.modelValue ?? ''"
      @input="(e) => emit('update:modelValue', e.target.value)"
      @focus="emit('focus')"
      @blur="emit('blur')"
      :placeholder="props.placeholder"
      class="w-full border-b border-gray-300 focus:outline-none focus:border-red-400 p-2 text-base"
      autocomplete="off"
    />
  </div>
</template>
