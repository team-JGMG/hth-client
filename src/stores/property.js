import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchSoldProperties } from '@/api/property'

export const usePropertyStore = defineStore('property', () => {
  const soldProperties = ref([])

  function setSoldProperties(properties) {
    soldProperties.value = properties
  }

  async function loadSoldProperties() {
    const data = await fetchSoldProperties()
    soldProperties.value = data.map((item) => ({
      propertyId: item.propertyId,
      thumbnailUrl: item.thumbnail?.photoUrl ?? null,
      yieldRate: item.yieldRate ?? null,
      title: item.title ?? '제목 없음',
    }))
  }

  return {
    soldProperties,
    setSoldProperties,
    loadSoldProperties,
  }
})
