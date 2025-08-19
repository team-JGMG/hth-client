<template>
  <div>
    <div class="flex items-center mb-2">
      <span class="material-symbols-outlined mb-2 mr-2"> add </span>
      <BaseTypography size="xl" weight="bold" class="mb-2">포인트 충전하기</BaseTypography>
    </div>
    <BaseTypography size="base" class="mb-2">충전하실 금액을 입력해주세요.</BaseTypography>
    <div class="flex justify-end items-end w-full mb-4">
      <div class="flex items-end border-b border-gray-300">
        <input
          type="text"
          placeholder="금액을 입력해주세요."
          class="w-60 p-2 focus:outline-none placeholder:text-gray-400"
          v-model="formattedAmount"
        />
      </div>
      <BaseTypography size="base" class="ml-2 mb-2">원</BaseTypography>
    </div>

    <div class="mt-6 flex items-center justify-between space-x-4">
      <BaseTypography size="base" class="mb-2">결제 수단</BaseTypography>
      <img src="@/assets/images/bankIcon/kakaopay.svg" alt="카카오페이" class="w-16 h-auto" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  modelValue: Number,
})
const emit = defineEmits(['update:modelValue'])

const localAmount = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formattedAmount = computed({
  get: () => {
    return localAmount.value?.toLocaleString() || ''
  },
  set: (value) => {
    const num = parseInt(value.replace(/,/g, ''), 10)
    localAmount.value = isNaN(num) ? 0 : num
  },
})
</script>
