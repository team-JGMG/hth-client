<template>
  <div class="px-4 mb-20">
    <section class="mt-4">
      <div class="flex items-center justify-between mb-2 relative">
        <BaseTypography class="text-lg" weight="bold">매각 완료</BaseTypography>

        <button
          ref="infoButtonRef"
          @click="toggleInfoPopover"
          class="flex items-center rounded-full text-gray-400 transition-colors p-1"
          aria-label="매각 완료 정보 보기"
        >
          <BaseTypography class="text-xs mr-1" weight="medium" color="gray-2"
            >누적 수익률</BaseTypography
          >
          <span class="material-symbols-outlined text-base mt-0.5">info</span>
        </button>

        <SaleCompletedInfoAccodian :is-open="showInfoPopover" @close="showInfoPopover = false" />
      </div>

      <div
        v-if="propertyStore.soldProperties.length > 0"
        class="flex gap-4 overflow-x-auto no-scrollbar px-2"
      >
        <SoldPropertyCard
          v-for="property in propertyStore.soldProperties"
          :key="property.id"
          :property="property"
        />
      </div>
      <div v-else class="text-gray-500 text-center py-4">매각 완료된 매물이 없습니다.</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePropertyStore } from '@/stores/property'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import SoldPropertyCard from './SoldPropertyCard.vue'
import SaleCompletedInfoAccodian from './SaleCompletedInfoAccodian.vue'
const propertyStore = usePropertyStore()
const showInfoPopover = ref(false)
const infoButtonRef = ref(null)

const toggleInfoPopover = () => {
  showInfoPopover.value = !showInfoPopover.value
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 목 데이터
  const mockSoldProperties = [
    {
      id: 1,
      title: '강남 아파트 매물',
      thumbnail_url: 'https://placehold.co/160x160/282828/ffffff?text=Property1',
      yield_rate: 7.76,
    },
    {
      id: 2,
      title: '서초 빌라 매물',
      thumbnail_url: 'https://placehold.co/160x160/333333/ffffff?text=Property2',
      yield_rate: 9.72,
    },
    {
      id: 3,
      title: '송파 오피스텔',
      thumbnail_url: 'https://placehold.co/160x160/444444/ffffff?text=Property3',
      yield_rate: 5.5,
    },
    {
      id: 4,
      title: '분당 상가',
      thumbnail_url: 'https://placehold.co/160x160/555555/ffffff?text=Property4',
      yield_rate: 12.15,
    },
    {
      id: 5,
      title: '판교 주택',
      thumbnail_url: 'https://placehold.co/160x160/666666/ffffff?text=Property5',
      yield_rate: 8.9,
    },
  ]
  propertyStore.setSoldProperties(mockSoldProperties)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// fetchSoldProperties 함수는 필요에 따라 주석 해제하여 사용
/*
const fetchSoldProperties = async () => {
  try {
    const response = await fetch(
      '/properties?status=SOLD&sort=created_at&order=desc&limit=10&skip=0',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      console.error(`HTTP 에러! 상태: ${response.status}`)
      propertyStore.setSoldProperties([])
      return
    }

    const data = await response.json()
    const soldItems = data.content || []
    propertyStore.setSoldProperties(soldItems)
  } catch (error) {
    console.error('매각 완료 매물을 가져오지 못했습니다:', error)
    propertyStore.setSoldProperties([])
  }
}
*/
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
