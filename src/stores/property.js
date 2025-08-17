import { defineStore } from 'pinia'
import { fetchUserProperties } from '@/api/property'
import { ref } from 'vue'
export const usePropertyStore = defineStore('property', () => {
  const soldProperties = ref([])
  const userProperties = ref([])

  function setSoldProperties(properties) {
    soldProperties.value = properties
  }
  const loadUserProperties = async () => {
    try {
      const propertyList = await fetchUserProperties()
      userProperties.value = propertyList
      soldProperties.value = propertyList.filter((item) => item.status === 'COMPLETED')
    } catch {
      userProperties.value = []
      soldProperties.value = []
    }
  }
  return {
    soldProperties,
    setSoldProperties,
    userProperties,
    loadUserProperties,
  }
})
