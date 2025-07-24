<template>
  <BaseCard class="h-26 flex items-center px-3 mb-4 border-none" style="background-color: #e3e9ff">
    <button
      class="flex flex-col items-center border-none w-full"
      @click="handleButtonClick"
      aria-label="거래 매물"
    >
      <div class="flex justify-between items-center gap-1">
        <BaseTypography class="text-left leading-tight break-keep ml-2" weight="bold">
          거래중인 매물, 실시간으로 관리하기
        </BaseTypography>
        <button
          class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>
      <img src="@/assets/images/character/HOMEch.png" alt="아이콘" class="w-20 mb-2 mt-2" />
    </button>
  </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleButtonClick = () => {
  if (authStore.getIsLoggedIn) {
    router.push('/trade/list')
  } else {
    router.push('/auth/login')
  }
}
</script>
