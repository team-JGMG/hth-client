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
          <BaseTypography size="xs" class="mr-1" weight="medium" color="gray-2">
            누적 수익률
          </BaseTypography>
          <span class="material-symbols-outlined mt-0.5">info</span>
        </button>

        <SaleCompletedInfoAccodian :is-open="showInfoPopover" @close="showInfoPopover = false" />
      </div>

      <div
        v-if="filteredSoldProperties.length > 0"
        class="flex gap-4 overflow-x-auto no-scrollbar px-2"
      >
        <SoldPropertyCard
          v-for="property in filteredSoldProperties"
          :key="property.propertyId"
          :property="property"
        />
      </div>
      <BaseTypography v-else class="text-center py-4" color="gray-1" size="sm">
        매각 완료된 매물이 없습니다.
      </BaseTypography>
    </section>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
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

const filteredSoldProperties = computed(() =>
  Array.isArray(propertyStore.soldProperties)
    ? propertyStore.soldProperties.filter((p) => p.yieldRate !== null)
    : [],
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  propertyStore.loadSoldProperties()
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
