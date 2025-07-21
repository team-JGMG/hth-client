<template>
  <BaseCard class="h-26 flex justify-between items-center px-6 mb-4">
    <!-- 가장 바깥쪽 button을 flex 컨테이너로 만들고, 자식 요소들을 가로로 정렬 -->
    <button
      class="w-full flex items-center justify-between p-0 border-none bg-transparent"
      @click="tradeListPage"
      aria-label="투자매물 탐색하기"
    >
      <BaseTypography class="text-left leading-tight" weight="bold">
        <span class="bg-yellow-200 rounded px-1">거래중인 매물</span>, 실시간으로<br />
        관리하세요!
      </BaseTypography>

      <div
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </div>
    </button>
  </BaseCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const router = useRouter()

const tradeListPage = () => {
  // 실제 펀딩 리스트 페이지 경로로 변경해주세요.
  router.push('/trade/list')
}
</script>
