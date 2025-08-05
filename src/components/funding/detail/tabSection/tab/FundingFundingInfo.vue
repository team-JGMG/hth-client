<template>
  <div>
    <div class="py-2"></div>
    <!-- 세부 정보 -->
    <BaseTypography size="base" weight="bold" class="mb-2"> 세부 정보 </BaseTypography>

    <BaseCard v-if="item.description" class="h-auto flex flex-col mb-4">
      <BaseTypography class="text-sm text-gray-700 whitespace-pre-line break-keep">
        {{ item.description }}
      </BaseTypography>
    </BaseCard>
    <!-- 유의사항 영역 -->
    <BaseTypography size="base" weight="bold" class="mb-2">유의사항</BaseTypography>

    <BaseTypography size="xs" color="red">※ 투자금은 손실 가능성이 있습니다.</BaseTypography>
    <BaseTypography size="xs" color="red"
      >※ 중도 환매 시 수수료가 발생할 수 있습니다.</BaseTypography
    >
    <BaseTypography size="xs" color="red"
      >※ 임대료 변동에 따라 수익률이 달라질 수 있습니다.</BaseTypography
    >
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
defineProps({ item: Object })
</script>
