<script setup>
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import SocialLoginButton from '@/components/common/Button/SocialLoginButton.vue'

const router = useRouter()
const goToSignUp = () => {
  router.push('/auth/signup')
}
</script>

<template>
  <BaseLayout>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <img src="@/assets/images/logo.png" alt="로고" class="w-32 h-32 mb-8" />

      <BaseTypography class="text-xl font-semibold text-center mb-2">
        소액으로 사는 집 한조각,<br />
        반의반집
      </BaseTypography>

      <div class="flex flex-col gap-3 w-full max-w-sm mt-6">
        <SocialLoginButton type="kakao" />
        <SocialLoginButton type="naver" />
        <SocialLoginButton type="google" />
      </div>
      <button class="mt-6 text-sm text-gray-500 underline" @click="goToSignUp">
        아직 회원이 아니신가요? 회원가입
      </button>
    </div>
  </BaseLayout>
</template>
