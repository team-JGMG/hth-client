<script setup lang="ts">
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    modelValue: string
  }>(),
  {
    placeholder: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="mb-5">
    <!-- 라벨 텍스트 -->
    <BaseTypography class="block text-sm font-medium mb-1">
      {{ props.label }}
    </BaseTypography>

    <!-- 입력 필드 -->
    <input
      :value="props.modelValue"
      @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      :placeholder="props.placeholder"
      class="w-full border-b border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
    />
  </div>
</template>
