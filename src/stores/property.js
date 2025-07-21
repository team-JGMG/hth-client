import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  const soldProperties = ref([]) // 매각 완료된 매물 목록

  function setSoldProperties(properties) {
    soldProperties.value = properties
  }

  return {
    soldProperties,
    setSoldProperties,
  }
})
