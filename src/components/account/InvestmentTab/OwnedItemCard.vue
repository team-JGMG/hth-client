<script setup>
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatAmount } from '@/utils/format'

defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['click', 'open-dividend'])

function onCardClick() {
  emit('click')
}

function onDividendClick(e) {
  e.stopPropagation()
  emit('open-dividend')
}
</script>

<template>
  <div
    class="flex justify-between bg-white rounded-lg border px-3 py-2 cursor-pointer hover:bg-gray-50"
    @click="onCardClick"
  >
    <div class="flex items-center">
      <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
      <div>
        <BaseTypography class="font-semibold text-sm !font-bold">{{ item.name }}</BaseTypography>
        <BaseTypography class="text-xs !text-gray-500 mt-1"
          >보유 주 수량: {{ item.ownedAmount }}주</BaseTypography
        >
        <BaseTypography class="text-xs !text-gray-400 mt-0.5"
          >평단가: {{ formatAmount(item.avgPrice) }}</BaseTypography
        >
      </div>
    </div>

    <div class="flex flex-col justify-between items-end ml-2 h-full" @click.stop>
      <BaseButton
        variant="secondary"
        @click="onDividendClick"
        class="text-xs px-0.6 mb-1 !py-0.5 btn-fixed whitespace-nowrap min-w-[76px]"
      >
        <BaseTypography class="text-[10px] font-medium !text-white">배당금 내역</BaseTypography>
      </BaseButton>
      <BaseTypography class="text-xs text-gray-500 mb-0.5">현재 시세</BaseTypography>
      <BaseTypography class="text-base font-semibold" style="color: #ff3b3b">
        {{ formatAmount(item.price) }}
      </BaseTypography>
    </div>
  </div>
</template>
