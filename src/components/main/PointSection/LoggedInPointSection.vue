<template>
  <div>
    <BaseTypography class="text-xl mb-1" color="white">{{
      userStore.userName ? `${userStore.userName}님,` : '???님,'
    }}</BaseTypography>

    <div class="flex items-baseline justify-between mb-4">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">
        {{ userStore.userPoints.toLocaleString() }}원
      </BaseTypography>
    </div>
    <div class="flex space-x-3 mb-4">
      <button class="flex-1 bg-green-400 text-black py-3 rounded-xl font-medium">
        <span class="material-symbols-outlined text-2xl">add</span>
        <br />
        <BaseTypography class="font-bold">포인트 충전</BaseTypography>
      </button>
      <button class="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-medium">
        <span class="material-symbols-outlined text-2xl">remove</span><br />
        <BaseTypography class="font-bold">포인트 환급</BaseTypography>
      </button>
    </div>
    <BaseCard class="h-6 flex justify-between items-center px-6"
      ><BaseTypography class="font-medium">포인트 관리하러 가기</BaseTypography>
      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="myPage"
        aria-label="투자매물 탐색하기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useUserStore } from '@/stores/user' // 스토어 임포트

const router = useRouter()
const userStore = useUserStore() // 스토어 인스턴스 생성

const myPage = () => {
  router.push('/account/my-page')
}
</script>
