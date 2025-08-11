<template>
  <header
    class="bg-white h-24 max-w-md mx-auto fixed top-0 left-0 right-0 z-50 py-6 flex items-center justify-between px-6"
  >
    <BaseLogo />

    <img
      src="@/assets/images/alert/alert.png"
      alt="알림"
      class="w-8 h-8 object-contain cursor-pointer"
      @click="goFcmTest"
    />
  </header>
  <div class="h-20"></div>
</template>

<script setup>
import BaseLogo from '@/components/common/Logo/BaseLogo.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goFcmTest = () => {
  router.push('/fcm-test')
}
</script>
