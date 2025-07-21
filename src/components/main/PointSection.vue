<template>
  <div class="bg-black rounded-2xl p-6 text-white">
    <BaseTypography class="text-xl mb-1" color="white">{{ userName }}님,</BaseTypography>

    <div class="flex items-baseline justify-between mb-4">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">{{ userPoints }}원</BaseTypography>
    </div>
    <div class="flex space-x-3 mb-4">
      <button
        class="flex-1 bg-green-400 text-black py-3 rounded-xl font-medium"
        @click="chargePoints"
      >
        <span class="material-symbols-outlined text-2xl">add</span><br />
        <BaseTypography class="font-bold">포인트 충전</BaseTypography>
      </button>
      <button
        class="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-medium"
        @click="refundPoints"
      >
        <span class="material-symbols-outlined text-2xl">remove</span><br />
        <BaseTypography class="font-bold">포인트 환급</BaseTypography>
      </button>
    </div>
    <BaseCard class="h-6 flex justify-between items-center px-6">
      <BaseTypography class="font-medium">포인트 관리하러 가기</BaseTypography>
      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="goToMyPage"
        aria-label="포인트 관리하러 가기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

// Props for dynamic data (you'll pass these from the parent)
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  userName: {
    type: String,
    default: '',
  },
  userPoints: {
    type: [String, Number],
    default: '0',
  },
})

// Emitting events for actions
const emit = defineEmits(['charge', 'refund', 'my-page'])

const chargePoints = () => {
  emit('charge')
}

const refundPoints = () => {
  emit('refund')
}

const goToMyPage = () => {
  emit('my-page')
}
</script>
