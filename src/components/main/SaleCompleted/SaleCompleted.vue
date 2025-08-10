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
        <!-- 최대 5개까지 카드 표시 -->
        <div
          v-for="property in propertyStore.soldProperties.slice(0, 5)"
          :key="property.id"
          class="min-w-[160px] flex-shrink-0 cursor-pointer"
          role="button"
          tabindex="0"
          @click="goToDetail(property.id)"
          @keydown.enter.space="goToDetail(property.id)"
        >
          <SoldPropertyCard :property="property" />
        </div>

        <!-- 더보기 카드 -->
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
const goToDetail = (id) => {
  router.push({ name: 'funding-detail', params: { id } })
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

const fetchSoldProperties = async () => {
  try {
    const response = await getSoldProperties()
    const parsedData = response.data?.map((item) => ({
      id: item.propertyId,
      title: item.title,
      yield_rate: item.cumulativeReturn,
      thumbnail_url: item.thumbnail?.photoUrl || '',
    }))
    propertyStore.setSoldProperties(parsedData)
  } catch (error) {
    console.error('매각 완료 매물 가져오기 실패:', error)
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
