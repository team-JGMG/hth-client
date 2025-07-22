<script setup>
import SignUpForm from '@/components/auth/SignUpForm.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
</script>

<template>
  <BlankLayout>
    <DetailHeader>회원가입</DetailHeader>
    <SignUpForm />
  </BlankLayout>
</template>
