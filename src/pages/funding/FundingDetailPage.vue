<template>
  <DetailLayout>
    <div v-if="loading" class="p-6">불러오는 중…</div>
    <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>
    <FundingItemCard v-else :item="viewModel" />
  </DetailLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import DetailLayout from '@/layouts/DetailLayout.vue'
import FundingItemCard from '@/components/funding/detail/FundingItemCard.vue'
import { getFundingById } from '@/api/funding'

const mapToViewModel = (d) => ({
  images: d.photos?.length ? d.photos : [{ photoUrl: '/src/assets/images/cardtestimage.png' }],
  title: d.title ?? '',
  address: d.address ?? '',
  targetAmount: d.targetAmount ?? null, // 총 투자금
  percent: d.fundingRate ?? null, // 달성률(%)
  currentAmount: d.currentAmount ?? null,
  fundingEndDate: d.fundingEndDate ?? null,

  usageDistrict: d.usageDistrict,
  buildingArea: d.buildingArea,
  landArea: d.landArea,
  totalFloorAreaBuilding: d.totalFloorAreaBuilding,
  totalFloorAreaProperty: d.totalFloorAreaProperty,
  basementFloors: d.basementFloors,
  groundFloors: d.groundFloors,
  approvalDate: d.approvalDate,
  officialLandPrice: d.officialLandPrice,
  unitPricePerPyeong: d.unitPricePerPyeong,
  createdAt: d.createdAt,

  seller: d.seller,
  description: d.description,
  propertyId: d.propertyId,
  fundingId: d.fundingId,
  daysLeft: d.daysLeft,
  expectedDividendPerShare: d.expectedDividendPerShare,
  currentShareAmount: d.currentShareAmount,
  tags: d.tags ?? [],
})

const route = useRoute()
const loading = ref(true)
const error = ref('')
const data = ref(null)

const viewModel = computed(() => (data.value ? mapToViewModel(data.value) : null))

onMounted(async () => {
  const id = Number(route.params.id || route.params.fundingId)
  console.log('[Detail] route id =', id)

  try {
    const res = await getFundingById(id)
    console.log('[Detail] raw response', res.data)
    const payload = res.data?.data
    if (!payload) throw new Error('empty payload')
    data.value = payload
    const vm = mapToViewModel(payload)

    console.log('[Detail] mapped viewModel', vm)
  } catch (e) {
    console.error('[Detail] fetch error', e?.response?.status, e?.response?.data || e)
    error.value = '상세 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>
