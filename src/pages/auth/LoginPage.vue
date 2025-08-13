<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import SocialLoginButton from '@/components/common/Button/SocialLoginButton.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const handleKakaoLogin = () => {
  const redirectUrl = `${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`
  window.location.href = redirectUrl
}
</script>

<template>
  <div class="py-6"></div>
  <BlankLayout>
    <div class="flex flex-col items-center justify-center w-full h-full px-6 py-12">
      <img src="@/assets/images/logo.png" alt="로고" class="w-32 h-32 mb-8" />

      <BaseTypography class="text-xl font-semibold text-center mb-2">
        소액으로 사는 집 한조각,<br />
        반의반집
      </BaseTypography>

      <div class="flex flex-col gap-3 w-full max-w-sm mt-6">
        <SocialLoginButton type="kakao" @click="handleKakaoLogin" />
        <SocialLoginButton type="naver" />
        <SocialLoginButton type="google" />
      </div>
    </div>
  </BlankLayout>
</template>
