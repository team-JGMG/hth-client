<script setup>
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  rrnFront: String,
  rrnBack: String,
})

const emit = defineEmits(['update:rrnFront', 'update:rrnBack'])

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
    <BaseTypography class="block text-sm font-medium mb-2">주민등록번호</BaseTypography>

    <div class="flex items-center gap-2">
      <input
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="앞 6자리"
        class="flex-[6] min-w-0 border-b border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
        :value="props.rrnFront"
        @input="(e) => emit('update:rrnFront', e.target.value.replace(/\D/g, ''))"
      />
      <BaseTypography class="text-gray-600">-</BaseTypography>
      <input
        type="password"
        inputmode="numeric"
        maxlength="7"
        placeholder="뒤 7자리"
        class="flex-[7] min-w-0 border-b border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
        :value="props.rrnBack"
        @input="(e) => emit('update:rrnBack', e.target.value.replace(/\D/g, ''))"
      />
    </div>
    <BaseTypography v-if="isInvalid" class="text-sm text-red-500 mt-1">
      정확한 주민등록번호를 입력해주세요. (앞 6자리 / 뒤 7자리)
    </BaseTypography>
  </div>
</template>
