<script setup>
import UserProfileHeader from '@/components/account/UserProfileHeader.vue'
import TabHeader from '@/components/account/TabHeader.vue'

import DetailLayout from '@/layouts/DetailLayout.vue'
</script>

<template>
  <DetailLayout>
    <div>
      <UserProfileHeader />
      <!-- 이메일, 보유포인트 등 -->
      <TabHeader />
      <!-- 상단 탭 버튼 -->
      <router-view />
      <!-- 하위 탭 컴포넌트 표시 -->
    </div>
  </DetailLayout>
</template>
