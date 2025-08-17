<template>
  <BaseModal :is-open="isOpen" @close="emit('close')">
    <div class="flex flex-col items-center justify-center p-4 text-center">
      <BaseTypography tag="h3" size="lg" weight="bold" class="mb-7 mt-3">
        <slot></slot>
      </BaseTypography>
      <span
        class="material-symbols-outlined text-blue-600"
        style="font-size: 128px; line-height: 1; display: inline-block"
      >
        check_circle
      </span>
    </div>

    <template #submit>
      <CompletedButton @click="handleSubmit">
        <slot name="submitText">닫기</slot>
      </CompletedButton>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import BaseTypography from '../Typography/BaseTypography.vue'
import CompletedButton from '../Button/CompletedButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  closeOnSubmit: { type: Boolean, default: true },
})

const emit = defineEmits(['close', 'submit'])

const handleSubmit = () => {
  emit('submit')
  if (props.closeOnSubmit) {
    emit('close')
  }
}
</script>

<style scoped></style>
