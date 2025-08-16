<template>
  <section class="mt-4 px-2 bg-white">
    <BaseTypography class="mb-2" weight="semibold" size="lg">매물의 건축물 대장 정보</BaseTypography>
    <div class="px-1 pb-2">
      <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">용도지역</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.usageDistrict }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">대지 면적(매물)</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.landArea }}㎡({{ formatAreaToPyeong(property.landArea) }})</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">대지 면적(건물)</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.buildingArea }}㎡({{ formatAreaToPyeong(property.buildingArea) }})</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">연면적(매물)</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.totalFloorAreaProperty }}㎡({{ formatAreaToPyeong(property.totalFloorAreaProperty) }})</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">연면적(건물)</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.totalFloorAreaBuilding }}㎡({{ formatAreaToPyeong(property.totalFloorAreaBuilding) }})</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">건물 규모</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2"> 지하 {{ property.basementFloors }}층 / 지상 {{ property.groundFloors }}층</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">준공일</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ formatDate(property.approvalDate) }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">공시지가</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ formatPriceInManwon(property.officialLandPrice) }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">연면적 평단가 <span class="text-xs text-gray-500">(평/공모금액 기준)</span></BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ formatPriceInManwon(property.unitPricePerPyeong) }}</BaseTypography>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatAreaToPyeong, formatDate, formatPriceInManwon } from '@/utils/format'

defineProps({
  property: Object,
})
</script>
