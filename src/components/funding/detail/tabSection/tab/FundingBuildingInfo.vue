<template>
  <BaseTypography size="base" weight="bold">건물 대장 정보</BaseTypography>

  <div class="border rounded-lg border-white overflow-hidden text-sm mb-3 p-4">
    <div class="grid grid-cols-2 border-b p-3" v-for="(value, key, idx) in infoList" :key="idx">
      <BaseTypography size="xs">
        {{ labels[key] }}
      </BaseTypography>
      <BaseTypography size="xs" class="pl-2">
        {{ displayValue(key, value) }}
      </BaseTypography>
    </div>
  </div>

  <BaseTypography size="base" weight="bold" class="mb-2">매도자 정보</BaseTypography>
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
        {{ formatPhoneNumber(item.seller?.phone || '-') }}
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
        {{ formatDate(item.createdAt) }}
      </BaseTypography>
    </div>
  </BaseCard>

  <BaseTypography tag="h2" size="base" weight="bold" class="mb-2">배당금</BaseTypography>
  <BaseCard class="flex-col space-y-3">
    <div class="bg-gray-100 rounded-lg py-4 text-center w-full">
      <BaseTypography size="lg" weight="bold">{{ item.expectedDividendPerShare }}원</BaseTypography>
      <BaseTypography size="xs" class="text-gray-500 mt-1">1주당 배당금 (세전)</BaseTypography>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import {
  format,
  formatDate,
  formatPriceInManwon,
  formatAreaToPyeong,
  formatPhoneNumber,
} from '@/utils/format'
import { getAllocations } from '@/api/funding'

const props = defineProps({ item: { type: Object, required: true } })

const manwon = (val) => (val === 0 ? '0만원' : formatPriceInManwon(val))
const pyeong = (area) => (area === 0 ? '0.0평' : formatAreaToPyeong(area))

const infoList = computed(() => {
  const it = props.item ?? {}
  return {
    usageDistrict: it.usageDistrict,
    buildingArea: it.buildingArea,
    landArea: it.landArea,
    totalFloorAreaBuilding: it.totalFloorAreaBuilding,
    totalFloorAreaProperty: it.totalFloorAreaProperty,
    scale: makeScale(it.basementFloors, it.groundFloors),
    approvalDate: it.approvalDate,
    officialLandPrice: it.officialLandPrice,
    unitPricePerPyeong: it.unitPricePerPyeong,
  }
})

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

const formatters = {
  approvalDate: (v) => (v !== null && v !== undefined ? formatDate(v) : '-'),
  buildingArea: (v) => (v !== null && v !== undefined ? `${format(v)} ㎡ (${pyeong(v)})` : '-'),
  landArea: (v) => (v !== null && v !== undefined ? `${format(v)} ㎡ (${pyeong(v)})` : '-'),
  totalFloorAreaBuilding: (v) =>
    v !== null && v !== undefined ? `${format(v)} ㎡ (${pyeong(v)})` : '-',
  totalFloorAreaProperty: (v) =>
    v !== null && v !== undefined ? `${format(v)} ㎡ (${pyeong(v)})` : '-',

  officialLandPrice: (v) => (v !== null && v !== undefined ? manwon(v) : '-'),
  unitPricePerPyeong: (v) => (v !== null && v !== undefined ? manwon(v) : '-'),

  scale: (v) => (v ? v : '-'),
  usageDistrict: (v) => (v ? v : '-'),
}

const defaultFormatter = (v) => {
  if (v === null || v === undefined) return '-'
  return typeof v === 'number' ? format(v) : v
}

const displayValue = (key, value) => (formatters[key] || defaultFormatter)(value)

function makeScale(basement, ground) {
  const hasB = basement !== null && basement !== undefined
  const hasG = ground !== null && ground !== undefined
  if (hasB && hasG) return `${basement}층(지하) / ${ground}층(지상)`
  if (hasB) return `${basement}층(지하)`
  if (hasG) return `${ground}층(지상)`
  return '-'
}

const dividendData = ref({
  month: '-',
  referenceDate: '-',
  paymentDate: '-',
  expectedDividendPerShare: null,
})

function toKRMonth(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}년 ${m}월`
}

function getPrevMonthEnd(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  const end = new Date(d.getFullYear(), d.getMonth(), 0)
  return formatDate(end)
}

function applyLatestAllocation(a) {
  if (!a) return
  dividendData.value = {
    month: toKRMonth(a.paymentDate),
    referenceDate: getPrevMonthEnd(a.paymentDate),
    paymentDate: formatDate(a.paymentDate),
    expectedDividendPerShare: a.expectedDividendPerShare ?? '-',
  }
}

async function loadAllocations(fid) {
  try {
    const res = await getAllocations(fid)
    const list = res.data?.data ?? []
    applyLatestAllocation(list[0])
  } catch {
    //
  }
}

watch(
  () => props.item?.fundingId,
  (fid) => {
    if (fid !== null && fid !== undefined) loadAllocations(fid)
  },
  { immediate: true },
)

onMounted(() => {
  if (props.item?.fundingId !== null && props.item?.fundingId !== undefined) {
    loadAllocations(props.item.fundingId)
  }
})
</script>
