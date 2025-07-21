<script setup lang="ts">
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps<{
  rrnFront: string
  rrnBack: string
}>()

const emit = defineEmits<{
  (e: 'update:rrnFront', value: string): void
  (e: 'update:rrnBack', value: string): void
}>()

const isFrontValid = computed(() => /^\d{6}$/.test(props.rrnFront))
const isBackValid = computed(() => /^\d{7}$/.test(props.rrnBack))
const isInvalid = computed(() => {
  return (
    (props.rrnFront !== '' && !isFrontValid.value) || (props.rrnBack !== '' && !isBackValid.value)
  )
})
</script>

<template>
  <div class="relative mb-8">
    <!-- 라벨 -->
    <BaseTypography class="block text-sm font-medium mb-2">주민등록번호</BaseTypography>

    <!-- 입력 필드 -->
    <div class="flex items-center space-x-2">
      <input
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="앞 6자리"
        class="w-28 border-b border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
        :value="props.rrnFront"
        @input="
          (e) => emit('update:rrnFront', (e.target as HTMLInputElement).value.replace(/\D/g, ''))
        "
      />
      <BaseTypography class="text-gray-600">-</BaseTypography>
      <input
        type="password"
        inputmode="numeric"
        maxlength="7"
        placeholder="뒤 7자리"
        class="w-32 border-b border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
        :value="props.rrnBack"
        @input="
          (e) => emit('update:rrnBack', (e.target as HTMLInputElement).value.replace(/\D/g, ''))
        "
      />
    </div>

    <!-- 에러 메시지 -->
    <BaseTypography v-if="isInvalid" class="text-sm text-red-500 mt-1">
      정확한 주민등록번호를 입력해주세요. (앞 6자리 / 뒤 7자리)
    </BaseTypography>
  </div>
</template>
