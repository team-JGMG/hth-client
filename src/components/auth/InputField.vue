<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  label: String,
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'focus'])
</script>

<template>
  <div class="mb-5">
    <!-- 라벨 텍스트 -->
    <BaseTypography class="block text-base font-medium mb-1">
      {{ props.label }}
    </BaseTypography>

    <!-- 입력 필드 -->
    <input
      :value="props.modelValue"
      @input="(e) => emit('update:modelValue', e.target.value)"
      @focus="emit('focus')"
      :placeholder="props.placeholder"
      class="w-full border-b border-gray-300 focus:outline-none focus:border-red-400 p-2 text-base"
    />
  </div>
</template>
