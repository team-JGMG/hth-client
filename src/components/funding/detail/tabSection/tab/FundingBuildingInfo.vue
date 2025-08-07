<template>
  <!-- 건물 대장 정보 -->
  <BaseTypography size="base" weight="bold" class="mb-2">건물 대장 정보</BaseTypography>

  <div class="border rounded-lg border-white overflow-hidden text-sm mb-3 p-4">
    <div
      class="grid grid-cols-2 border-b p-3"
      v-for="(value, key, idx) in infoList"
      :key="idx"
      :class="[
        labels[key] === '용도지역' ? 'bg-gray-100' : '',
        value === '제2종 일반주거지역' ? 'bg-gray-100' : '',
      ]"
    >
      <BaseTypography size="xs">
        {{ labels[key] }}
      </BaseTypography>
      <BaseTypography size="xs" class="pl-2">
        {{ format(value) }}
      </BaseTypography>
    </div>
  </div>

  <BaseTypography size="base" weight="bold" class="mb-2">매도자 정보</BaseTypography>
  <!-- 매도자 정보 -->
  <BaseCard class="h-auto flex flex-col mb-5">
    <div class="flex justify-between mb-1">
      <BaseTypography size="xs" weight="medium">이름</BaseTypography>
      <BaseTypography size="xs" weight="medium" class="text-right">
        {{ item.seller?.name || '-' }}
      </BaseTypography>
    </div>
    <div class="flex justify-between mb-1">
      <BaseTypography size="xs" weight="medium">전화번호</BaseTypography>
      <BaseTypography size="xs" weight="medium" class="text-right">
        {{ item.seller?.phone || '-' }}
      </BaseTypography>
    </div>
    <div class="flex justify-between mb-1">
      <BaseTypography size="xs" weight="medium">이메일</BaseTypography>
      <BaseTypography size="xs" weight="medium" class="text-right">
        {{ item.seller?.email || '-' }}
      </BaseTypography>
    </div>
    <div class="flex justify-between">
      <BaseTypography size="xs" weight="medium">등록일</BaseTypography>
      <BaseTypography size="xs" weight="medium" class="text-right">
        {{ formatDate(item.soldAt) }}
      </BaseTypography>
    </div>
  </BaseCard>

  <BaseTypography tag="h2" size="base" weight="bold" class="mb-2">배당금</BaseTypography>
  <BaseCard class="flex-col space-y-3">
    <!-- 지급 월 -->
    <BaseTypography size="base" weight="bold">{{ dividendData.month }}</BaseTypography>

    <!-- 기준일/지급일 -->
    <!-- 기준일 / 지급일 -->
    <div
      class="space-y-1 text-xs text-black w-full pb-2"
      style="
        border-bottom: 2px dotted #d1d5db;
        border-style: dotted;
        border-image: none;
        border-bottom-style: dotted;
      "
    >
      <div class="flex justify-between">
        <BaseTypography size="xs">배당 기준일</BaseTypography>
        <BaseTypography size="xs">{{ dividendData.referenceDate }}</BaseTypography>
      </div>

      <div class="flex justify-between">
        <BaseTypography size="xs">배당 지급일</BaseTypography>
        <BaseTypography size="xs">{{ dividendData.paymentDate }}</BaseTypography>
      </div>
    </div>

    <!-- 금액 박스 -->
    <div class="bg-gray-100 rounded-lg py-4 text-center w-full">
      <BaseTypography size="lg" weight="bold">{{ dividendData.amount }}원</BaseTypography>
      <BaseTypography size="xs" class="text-gray-500 mt-1">1주당 배당금 (세전)</BaseTypography>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { format, formatDate } from '@/utils/format' // ✅ 유틸에서 불러오기
const props = defineProps({ item: Object })
import BaseCard from '@/components/common/Card/BaseCard.vue'

const infoList = {
  usageDistrict: props.item.usageDistrict,
  buildingArea: props.item.buildingArea,
  landArea: props.item.landArea,
  totalFloorAreaBuilding: props.item.totalFloorAreaBuilding,
  totalFloorAreaProperty: props.item.totalFloorAreaProperty,
  scale: `${props.item.basementFloors}층(지하) / ${props.item.groundFloors}층(지상)`,

  approvalDate: props.item.approvalDate,
  officialLandPrice: props.item.officialLandPrice,
  unitPricePerPyeong: props.item.unitPricePerPyeong,
}

const labels = {
  usageDistrict: '용도지역',
  buildingArea: '대지 면적(매물)',
  landArea: '대지 면적(건물)',
  totalFloorAreaBuilding: '연면적(건물)',
  totalFloorAreaProperty: '연면적(매물)',
  scale: '건물 규모',
  approvalDate: '준공일',
  officialLandPrice: '공시지가',
  unitPricePerPyeong: '연면적 평단가',
}
const dividendData = {
  month: '2024년 08월',
  referenceDate: '2024년 08월 30일',
  paymentDate: '2024년 09월 30일',
  amount: 25,
}
</script>
