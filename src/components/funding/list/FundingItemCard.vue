<template>
  <div>
    <div class="relative border rounded-xl overflow-hidden shadow-sm bg-white">
      <!-- 상태 뱃지 -->
      <div
        class="absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold rounded-md text-white"
        :class="getBadgeColor(item.status)"
      >
        {{ status }}
      </div>

      <img
        :src="item.thumbnail?.photoUrl || testImage"
        alt="펀딩 이미지"
        class="w-full h-[120px] object-cover"
      />

      <!-- 매각 완료 오버레이 -->
      <div
        v-if="status === '매각 완료'"
        class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-0"
      >
        <div class="text-white text-lg font-bold mb-1">매각 완료</div>
        <div class="text-white text-sm">누적 수익률</div>
        <div class="text-white text-sm">
          {{ item.yield != null ? (item.yield > 0 ? '+' : '') + item.yield.toFixed(2) + '%' : '-' }}
        </div>
      </div>

      <div class="p-3">
        <BaseTypography class="text-sm font-semibold text-gray-800">{{
          item.title
        }}</BaseTypography>
        <BaseTypography class="text-[10px] text-gray-500 mt-0.5">{{ item.address }}</BaseTypography>

        <div class="flex flex-wrap gap-1 mt-1 mb-2">
          <span class="bg-gray-100 text-[10px] text-gray-600 px-2 py-0.5 rounded-full"
            >#수익형</span
          >
          <span class="bg-gray-100 text-[10px] text-gray-600 px-2 py-0.5 rounded-full">#투자</span>
        </div>

        <div class="flex justify-between items-center mb-1">
          <BaseTypography
            class="text-xs font-bold text-gray-800"
            size="xs"
            weight="bold"
            color=""
            >{{ formatAmount(item.targetAmount) }}</BaseTypography
          >
          <BaseTypography
            class="text-[10px]"
            weight="medium"
            :class="item.fundingRate === 100 ? 'text-red-500' : 'text-blue-600'"
          >
            {{ item.fundingRate }}%
          </BaseTypography>
        </div>

        <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500"
            :class="item.fundingRate === 100 ? 'bg-red-500' : 'bg-blue-600'"
            :style="{ width: item.fundingRate + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- :style="{ width: Math.max(0, item.fundingRate) + '%' }" -->
<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import testImage from '@/assets/images/cardtestimage.png'
import { formatAmount } from '@/utils/format.js'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

// 상태 뱃지 색상
function getBadgeColor(status) {
  switch (status) {
    case '모집 중':
      return 'bg-green-500'
    case '펀딩 완료':
      return 'bg-red-500'
    case '매각 완료':
      return 'bg-black'
    default:
      return 'bg-gray-400'
  }
}
</script>
