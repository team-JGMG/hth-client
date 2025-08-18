<template>
  <div class="mb-20">
    <section class="mt-4">
      <div class="flex items-center justify-between mb-2 relative">
        <BaseTypography class="text-lg" weight="bold">매각 완료</BaseTypography>

        <button
          ref="infoButtonRef"
          @click="toggleInfoPopover"
          class="flex items-center rounded-full text-gray-400 transition-colors p-1"
          aria-label="매각 완료 정보 보기"
        >
          <BaseTypography class="text-xs mr-1" weight="medium" color="gray-2">
            누적 수익률
          </BaseTypography>
          <span class="material-symbols-outlined mt-0.5" style="font-size: 16px">info</span>
        </button>

        <SaleCompletedInfoAccodian :is-open="showInfoPopover" @close="showInfoPopover = false" />
      </div>

      <div
        v-if="propertyStore.soldProperties.length > 0"
        class="flex gap-4 overflow-x-auto no-scrollbar px-2"
      >
        <div
          v-for="property in propertyStore.soldProperties.slice(0, 5)"
          :key="property.id ?? property.propertyId"
          class="min-w-[160px] flex-shrink-0 cursor-pointer"
          role="button"
          tabindex="0"
          @click="goToFundingDetail(property)"
          @keydown.enter.prevent="goToFundingDetail(property)"
          @keydown.space.prevent="goToFundingDetail(property)"
        >
          <SoldPropertyCard :property="property" />
        </div>

        <BaseTypography
          color="gray-1"
          size="sm"
          class="min-w-[160px] h-[160px] flex-shrink-0 rounded-xl bg-gray-100 hover:bg-gray-200 transition cursor-pointer flex items-center justify-center"
          @click="goToSaleCompletedPage"
        >
          더보기
        </BaseTypography>
      </div>

      <div v-else class="text-gray-500 text-center py-4">매각 완료된 매물이 없습니다.</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property'
import { getSoldProperties } from '@/api/property'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import SoldPropertyCard from './SoldPropertyCard.vue'
import SaleCompletedInfoAccodian from './SaleCompletedInfoAccodian.vue'

const propertyStore = usePropertyStore()
const router = useRouter()

const showInfoPopover = ref(false)
const infoButtonRef = ref(null)

const toggleInfoPopover = () => {
  showInfoPopover.value = !showInfoPopover.value
}

const goToFundingDetail = (item) => {
  const id = item?.fundingId
  if (!id) return
  router.push({ name: 'funding-detail', params: { id }, query: { stage: 'completedSale' } })
}

const handleClickOutside = (event) => {
  if (
    showInfoPopover.value &&
    infoButtonRef.value &&
    !infoButtonRef.value.contains(event.target) &&
    !event.target.closest('.info-popover')
  ) {
    showInfoPopover.value = false
  }
}

const normalizeSoldItems = (rawArr) => {
  return rawArr.map((item) => ({
    id: item.propertyId ?? item.property_id ?? item.property?.id ?? item.id ?? null,
    fundingId: item.fundingId ?? item.funding_id ?? item.funding?.id ?? null,
    title: item.title ?? item.propertyTitle ?? item.name ?? item.property?.title ?? '',
    yield_rate:
      item.cumulativeReturn ?? item.yield_rate ?? item.cumulative_return ?? item.roi ?? null,
    thumbnail_url:
      item.thumbnail?.photoUrl ??
      item.thumbnail_url ??
      item.thumbnailUrl ??
      item.photoUrl ??
      item.image_url ??
      '',
    __raw: item,
  }))
}

const fetchSoldProperties = async () => {
  try {
    const response = await getSoldProperties()
    const raw = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response)
          ? response
          : []
    const parsedData = normalizeSoldItems(raw)
    propertyStore.setSoldProperties(parsedData)
  } catch {
    propertyStore.setSoldProperties([])
  }
}

const goToSaleCompletedPage = () => {
  router.push('/funding/list/completed-sale')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchSoldProperties()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
