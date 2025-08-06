<script setup>
import SignUpForm from '@/components/auth/SignUpForm.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { ref, onMounted } from 'vue'

const isReady = ref(false)

onMounted(() => {
  // 렌더링 0.5초 (500ms → 테스트로 5000ms 설정)
  setTimeout(() => {
    isReady.value = true
  }, 3000) // ✅ 여긴 원하는 시간으로 조절 가능 (보통 300~800ms 추천)
})
</script>

<template>
  <div v-if="isReady">
    <BlankLayout>
      <DetailHeader>회원가입</DetailHeader>

      <!-- ✅ 여기가 핵심 -->

      <SignUpForm />
    </BlankLayout>
  </div>
</template>
