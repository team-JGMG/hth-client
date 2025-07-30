<template>
  <BaseModal :is-open="isOpen" @close="emit('close')">
    <div class="flex flex-col items-center justify-center p-4 text-center">
      <BaseTypography tag="h3" size="lg" weight="bold" class="mb-7 mt-3">
        <slot></slot>
      </BaseTypography>
      <span class="material-symbols-outlined text-blue-600 text-8xl">check_circle</span>
    </div>

    <template #submit>
      <CompletedButton @click="goToHome"><slot name="submitText">닫기</slot></CompletedButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseModal from './BaseModal.vue'
import BaseTypography from '../Typography/BaseTypography.vue'
import CompletedButton from '../Button/CompletedButton.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const router = useRouter()

const goToHome = () => {
  router.push('/account/my-page/investments')
  emit('close')
}
</script>

<style scoped></style>
