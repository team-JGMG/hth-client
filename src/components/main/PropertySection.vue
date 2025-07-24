<template>
  <BaseCard class="h-auto pb-6 mb-6 flex flex-col gap-4">
    <button @click="handleButtonClick" aria-label="보유 매물 등록하기">
      <div class="flex justify-between items-center">
        <BaseTypography class="text-left leading-tight" weight="bold">
          보유 매물을 등록하고 <br />
          새로운 가치를 만들어 보세요!
        </BaseTypography>
        <button
          class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>
    </button>
    <div class="flex flex-row gap-2 overflow-x-auto no-scrollbar">
      <div class="flex-shrink-0 min-w-[160px] bg-gray-100 rounded-xl p-4 flex items-center">
        <div class="flex flex-col items-start">
          <BaseTypography class="text-xs font-regular" color="gray-1" weight="medium">
            건물주가 되어 받는
          </BaseTypography>
          <div class="flex items-center gap-1">
            <BaseTypography class="mr-5 leading-tight" size="lg" weight="semibold" color="gray-1">
              임대 수익
            </BaseTypography>
            <span class="material-symbols-outlined text-2xl text-yellow-500">home_work</span>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 bg-gray-100 rounded-xl p-4 flex items-center">
        <div class="flex flex-col items-start">
          <BaseTypography class="text-xs font-regular" color="gray-1" weight="medium">
            건물 가격 상승하면 얻는
          </BaseTypography>
          <div class="flex items-center gap-1">
            <BaseTypography class="mr-5 leading-tight" size="lg" weight="semibold" color="gray-1">
              시세 차익
            </BaseTypography>
            <span class="material-symbols-outlined text-2xl text-blue-500">trending_up</span>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 bg-gray-100 rounded-xl p-4 flex items-center">
        <div class="flex flex-col items-start">
          <BaseTypography class="text-xs font-regular" color="gray-1" weight="medium">
            임대수익 정산으로 받는
          </BaseTypography>
          <div class="flex items-center gap-1">
            <BaseTypography class="mr-5 leading-tight" size="lg" weight="semibold" color="gray-1">
              정기 배당금
            </BaseTypography>
            <span class="material-symbols-outlined text-2xl text-green-500">calendar_clock</span>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
<script setup>
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useRouter } from 'vue-router'
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
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
