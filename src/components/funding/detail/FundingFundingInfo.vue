<template>
  <div>
    <div class="py-2"></div>
    <!-- 세부 정보 -->
    <BaseTypography tag="h2" class="text-base !font-bold mb-3 text-left">
      세부 정보
    </BaseTypography>
    <div v-if="item.description" class="rounded-xl p-4 mb-6 border">
      <BaseTypography class="text-sm text-gray-700 whitespace-pre-line break-keep">
        {{ item.description }}
      </BaseTypography>
    </div>
    <div class="py-1"></div>
    <!-- 유의사항 영역 -->
    <BaseTypography tag="h2" class="text-base !font-bold mb-3">유의사항</BaseTypography>

    <ul class="text-xs text-red-500 list-disc pl-5 space-y-1">
      <li>투자금은 손실 가능성이 있습니다.</li>
      <li>중도 환매 시 수수료가 발생할 수 있습니다.</li>
      <li>임대료 변동에 따라 수익률이 달라질 수 있습니다.</li>
    </ul>
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
defineProps({ item: Object })
</script>
