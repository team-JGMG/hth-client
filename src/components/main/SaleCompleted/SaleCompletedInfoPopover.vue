<template>
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center"
    >
      <div
        @click.stop
        class="bg-white p-9 rounded-t-xl shadow-lg w-full max-w-md text-black transform transition-transform duration-300 ease-out"
      >
        <BaseTypography class="text-xl mb-2 text-start" weight="bold">누적 수익률</BaseTypography>
        <BaseTypography class="text-sm text-center mb-6">
          매각까지의 누적 운용배당금 및 매각 차익 금액의 합산 수익률입니다.
        </BaseTypography>

        <button
          @click="emit('close')"
          class="w-full bg-black text-white py-3 rounded-lg font-medium active:bg-gray-500 transition-colors"
        >
          <BaseTypography class="text-lg" color="white">확인</BaseTypography>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { defineProps } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-active .bg-white,
.slide-up-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.slide-up-enter-from .bg-white,
.slide-up-leave-to .bg-white {
  transform: translateY(100%);
}
</style>
