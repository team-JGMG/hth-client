<template>
  <div>
    <!-- 제목 + 주소 -->
    <div class="pt-5">
      <BaseTypography size="xl" weight="bold" class="mb-1">{{ item.title }}</BaseTypography>
      <BaseTypography size="xs" color="gray-1" class="flex items-center text-gray-500">
        <span class="mr-1">
          <span
            class="material-symbols-rounded align-text-center relative top-[1px]"
            style="font-size: 1rem"
          >
            location_on
          </span>
        </span>
        {{ item.address }}
      </BaseTypography>
    </div>

    <!-- 해시태그 -->
    <BaseTypography size="xs" color="gray-2" class="mt-2 flex flex-wrap gap-2">
      <span class="bg-gray-100 px-2 py-1 rounded-full">#역세권</span>
      <span class="bg-gray-100 px-2 py-1 rounded-full">#신축</span>
      <span class="bg-gray-100 px-2 py-1 rounded-full">#고수익 기대</span>
    </BaseTypography>

    <!-- 총 투자 금액 -->
    <div class="mt-4 flex items-baseline gap-1 mb-4">
      <BaseTypography size="lg" weight="bold"> 총 투자 금액: </BaseTypography>
      <BaseTypography size="lg" weight="bold">
        {{ formatAmount(item.targetAmount) }}
      </BaseTypography>
    </div>

    <!-- 펀딩 진행 박스 -->
    <BaseCard class="h-auto flex flex-col mb-2">
      <div class="bg-white rounded-xl">
        <BaseTypography size="base" weight="bold" class="mb-2">펀딩 진행 현황</BaseTypography>
        <div class="mt-4 flex justify-between gap-1 mb-2">
          <BaseTypography size="sm" class="items-center mb-1"> 달성률</BaseTypography>
          <BaseTypography color="blue" weight="bold" size="sm"
            >{{ item.percent || 0 }}%</BaseTypography
          >
        </div>

        <div class="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-blue-600 transition-all duration-300"
            :style="{ width: (item.percent || 0) + '%' }"
          ></div>
        </div>
        <BaseTypography color="gray-1" size="xs" class="flex justify-between mb-1">
          현재 모집액
          <span>{{ formatAmount(item.currentAmount) }}</span>
        </BaseTypography>
        <BaseTypography color="gray-1" size="xs" class="flex justify-between mb-1">
          <span>목표 모집액</span>
          <span>{{ formatAmount(item.targetAmount) }}</span>
        </BaseTypography>
        <BaseTypography
          size="xs"
          weight="bold"
          class="mt-2 text-right transition-colors duration-300"
          :style="{ color: blinkColor }"
        >
          모집 마감: {{ formatDate(item.fundingEndDate) }} (D-{{ item.daysLeft }})
        </BaseTypography>
      </div>
    </BaseCard>

    <!-- 지정가 거래 정보 -->
    <BaseCard class="h-auto flex flex-col">
      <div class="bg-white rounded-xl">
        <BaseTypography size="base" weight="bold" class="mb-2">지정가 거래 정보</BaseTypography>
        <div class="flex justify-between text-sm text-gray-700">
          <BaseTypography size="sm" class="items-center mb-1">1주당 가격</BaseTypography>
          <BaseTypography size="sm" class="items-center mb-1"
            >{{ format(item.currentShareAmount) }}원</BaseTypography
          >
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import { format, formatDate, formatAmount } from '@/utils/format'
import { watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

watch(
  () => props.item,
  (nv) => {
    console.log('[Overview] fields', {
      title: nv?.title,
      currentAmount: nv?.currentAmount,
      targetAmount: nv?.price ?? nv?.targetAmount,
      fundingRate: nv?.percent ?? nv?.fundingRate,
      fundingEndDate: nv?.fundingEndDate,
    })
  },
  { immediate: true },
)

const blinkColor = ref('red')
let blinkInterval = null

onMounted(() => {
  // 펀딩 마감 D-7 이하이면 색상 깜빡임 시작
  const remainingDays = props.item.daysLeft
  if (remainingDays <= 7) {
    blinkInterval = setInterval(() => {
      blinkColor.value = blinkColor.value === 'red' ? 'orange' : 'red'
    }, 500)
  }
})

onBeforeUnmount(() => {
  if (blinkInterval) clearInterval(blinkInterval)
})
</script>
