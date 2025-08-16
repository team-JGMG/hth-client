<template>
  <section class="mt-4 px-2 bg-white">
    <BaseTypography class="mb-2" weight="semibold" size="lg">매물 정보</BaseTypography>
    <div class="px-1 pb-2">
      <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">매물명</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.title }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">매물 주소</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.address }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">매물 면적</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.area }}㎡({{ formatAreaToPyeong(property.area) }})</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">희망 매매가</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ formatPriceInManwon(property.price) }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">희망 공모 기간</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.postingPeriod }}개월</BaseTypography>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatPriceInManwon, formatAreaToPyeong } from '@/utils/format'

defineProps({
  property: Object,
})
</script>
