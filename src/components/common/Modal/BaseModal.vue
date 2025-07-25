<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div @click.stop class="max-w-96 relative bg-white rounded-lg p-5 box-border">
        <button
          type="button"
          aria-label="닫기"
          @click="emit('close')"
          class="absolute top-4 right-4"
        >
          <span
            class="material-symbols-outlined"
            style="
              font-size: 1rem;
              color: #838a9a;
              width: 1rem;
              height: 1rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
          >
            close
          </span>
        </button>
        <slot />
        <button
          class="block w-80 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mt-8"
          :class="submitButtonClass"
          type="button"
          aria-label="제출"
          @click="emit('submit')"
        >
          <slot name="submit">
            <BaseTypography class="text-white font-medium text-base"> 제출하기 </BaseTypography>
          </slot>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import BaseTypography from '../Typography/BaseTypography.vue'

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['close', 'submit'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>
