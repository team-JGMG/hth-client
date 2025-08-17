<script setup>
import SignUpForm from '@/components/auth/SignUpForm.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { ref, onMounted } from 'vue'

const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 3000)
})
</script>

<template>
  <div v-if="isReady">
    <BlankLayout>
      <DetailHeader>회원가입</DetailHeader>
      <SignUpForm />
    </BlankLayout>
  </div>
</template>
