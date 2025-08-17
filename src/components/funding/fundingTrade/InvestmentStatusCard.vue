<template>
  <div class="bg-gray-50 rounded-xl border border-gray-300 p-4">
    <BaseTypography size="lg" weight="bold" class="mb-3">투자 가능 현황</BaseTypography>

    <div class="flex justify-between text-sm mb-2">
      <BaseTypography size="sm" class="font-semibold">현재 보유 주</BaseTypography>
      <BaseTypography size="sm" weight="medium" class="text-right">
        {{ formatNumber(item.userShareCount) }}주 ({{
          formatNumber(item.userShareCount * item.shareAmount)
        }}원)
      </BaseTypography>
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center space-x-1">
        <span class="material-symbols-outlined"> local_atm</span>
        <BaseTypography size="base" weight="bold">보유 포인트</BaseTypography>
      </div>

      <div class="flex items-center space-x-2">
        <BaseTypography size="base" weight="bold">
          {{ formatNumber(Number(item.userPoints ?? 0)) }}원
        </BaseTypography>
        <BaseButton
          variant="secondary"
          class="px-2 py-1 rounded-[10px] text-white hover:bg-gray-700 text-sm cursor-pointer"
          @click="$emit('charge')"
        >
          <BaseTypography size="sm" class="!text-white">충전하기</BaseTypography>
        </BaseButton>
      </div>
    </div>

    <div class="flex justify-end items-center gap-8 text-sm mt-2 font-bold">
      <BaseTypography class="!text-blue-600">+{{ formatNumber(quantity || 0) }}주</BaseTypography>
      <BaseTypography class="!text-red-500">-{{ formatNumber(totalPrice) }}원</BaseTypography>
    </div>

    <div class="border-t pt-3 mt-3 text-base">
      <div class="flex justify-between mb-2">
        <BaseTypography size="base" weight="medium" class="!text-gray-600">
          잔여 포인트
        </BaseTypography>
        <BaseTypography class="!font-bold">
          {{ formatNumber(Math.max(0, Number(item.userPoints ?? 0) - totalPrice)) }}원
        </BaseTypography>
      </div>

      <div class="flex justify-between mb-2">
        <BaseTypography size="base" weight="medium" class="!text-gray-600">
          내 보유주
        </BaseTypography>
        <BaseTypography class="!font-bold">
          {{ formatNumber(item.userShareCount + Number(quantity)) }}주 ({{
            formatNumber((item.userShareCount + Number(quantity)) * item.shareAmount)
          }}원)
        </BaseTypography>
      </div>

      <div class="flex justify-between">
        <BaseTypography size="base" weight="medium" class="!text-gray-600">
          매물 잔여 주
        </BaseTypography>
        <BaseTypography class="!font-bold">
          {{ formatNumber(Math.max(0, (item.remainingShares ?? 0) - Number(quantity))) }}주
        </BaseTypography>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
})

defineEmits(['charge'])

const formatNumber = (num) => {
  const number = Number(num)
  return Number.isNaN(number) ? '0' : number.toLocaleString()
}
</script>
