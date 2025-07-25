<template>
  <div class="py-2"></div>
  <div>
    <!-- 건물 대장 정보 -->
    <BaseTypography tag="h2" class="text-base !font-bold mb-2">건물 대장 정보</BaseTypography>
    <div class="border rounded-lg overflow-hidden text-sm mb-6">
      <div class="grid grid-cols-2 border-b p-3" v-for="(value, key, idx) in infoList" :key="idx">
        <BaseTypography class="font-medium">
          {{ labels[key] }}
        </BaseTypography>
        <BaseTypography class="pl-2">
          {{ format(value) }}
        </BaseTypography>
      </div>
    </div>

    <!-- 매도자 정보 -->
    <BaseTypography tag="h2" class="text-base !font-bold mb-2">매도자 정보</BaseTypography>
    <div class="border rounded-lg p-3 text-sm space-y-2">
      <div class="flex justify-between">
        <BaseTypography class="font-medium">이름:</BaseTypography>
        <BaseTypography class="text-right">{{ item.seller?.name || '-' }}</BaseTypography>
      </div>
      <div class="flex justify-between">
        <BaseTypography class="font-medium">전화번호:</BaseTypography>
        <BaseTypography class="text-right">{{ item.seller?.phone || '-' }}</BaseTypography>
      </div>
      <div class="flex justify-between">
        <BaseTypography class="font-medium">이메일:</BaseTypography>
        <BaseTypography class="text-right">{{ item.seller?.email || '-' }}</BaseTypography>
      </div>
      <div class="flex justify-between">
        <BaseTypography class="font-medium">등록일:</BaseTypography>
        <BaseTypography class="text-right">{{ formatDate(item.soldAt) }}</BaseTypography>
      </div>
    </div>
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { format, formatDate } from '@/utils/format' // ✅ 유틸에서 불러오기
const props = defineProps({ item: Object })

const infoList = {
  address: props.item.address,
  scale: `${props.item.basementFloors}층(지하) / ${props.item.groundFloors}층(지상)`,
  propertyType: props.item.propertyType,
  totalFloorAreaBuilding: props.item.totalFloorAreaBuilding,
  totalFloorAreaProperty: props.item.totalFloorAreaProperty,
  buildingArea: props.item.buildingArea,
  landArea: props.item.landArea,
  usageDistrict: props.item.usageDistrict,
  approvalDate: props.item.approvalDate,
  officialLandPrice: props.item.officialLandPrice,
  unitPricePerPyeong: props.item.unitPricePerPyeong,
}

const labels = {
  address: '주소',
  scale: '규모',
  propertyType: '거래대상',
  totalFloorAreaBuilding: '연면적(건물)',
  totalFloorAreaProperty: '연면적(매물)',
  buildingArea: '거래 연면적',
  landArea: '전체 대지 면적',
  usageDistrict: '용도지역',
  approvalDate: '준공년월',
  officialLandPrice: '공시지가',
  unitPricePerPyeong: '연면적 평단가',
}
</script>
