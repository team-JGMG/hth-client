<template>
  <div>
    <div class="mb-16">
      <div class="flex justify-center">
        <BaseButton
          class="bg-white border-gray-300 text-gray-800 text-sm font-medium rounded-[10px] justify-center gap-1 hover:bg-white"
          @click="$emit('reset')"
        >
          <BaseTypography class="cursor-pointer flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">refresh</span>
            초기화
          </BaseTypography>
        </BaseButton>
      </div>
      <BaseButton
        class="w-full py-3 text-m rounded-[10px] flex justify-center items-center text-center"
        :class="
          isLoggedIn && isValid && !hasValidationError
            ? '!bg-black text-white hover:bg-gray-900 cursor-pointer'
            : '!bg-gray-300 text-white cursor-not-allowed'
        "
        :disabled="!isLoggedIn || !isValid || hasValidationError"
        @click="$emit('funding')"
      >
        {{ isLoggedIn ? '펀딩하기' : '로그인 후 펀딩하기' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  hasValidationError: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['reset', 'funding'])
</script>
