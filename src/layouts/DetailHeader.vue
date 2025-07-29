<template>
  <header
    class="bg-white h-24 max-w-md mx-auto fixed top-0 left-0 right-0 z-50 py-6 flex items-center justify-start px-6"
  >
    <button
      class="w-8 h-8 flex justify-center items-center text-black mr-2"
      @click="goBack"
      aria-label="뒤로 가기"
    >
      <span class="material-symbols-outlined text-2xl">chevron_left</span>
    </button>
    <BaseTypography class="flex-grow text-start text-2xl" weight="bold">
      <slot></slot>
    </BaseTypography>
  </header>
  <div class="h-20"></div>
</template>
<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import { useRouter, useRoute } from 'vue-router'

const store = usePropertyRegisterStore()
const router = useRouter()
const route = useRoute()

const goBack = () => {
  if (route.name === 'property-register' && store.step > 1) {
    store.goToPrevStep()
  } else {
    router.go(-1)
  }
}
</script>
