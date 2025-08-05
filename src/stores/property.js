import { fetchSoldProperties, fetchUserProperties } from '@/api/property'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  const soldProperties = ref([]) // 매각 완료된 매물 목록
  const userProperties = ref([]) // 전체 사용자 매물 목록

  function setSoldProperties(properties) {
    soldProperties.value = properties
  }

  const loadUserProperties = async (userId) => {
    try {
      const propertyList = await fetchUserProperties(userId)
      console.log('✅ API 응답:', propertyList)
      userProperties.value = propertyList

      soldProperties.value = propertyList.filter((item) => item.status === 'COMPLETED')
    } catch (error) {
      console.error('❌ 매물 조회 실패:', error)
      userProperties.value = []
      soldProperties.value = []
    }
  }

  // 매각 완료된 매물 조회
  const loadSoldProperties = async () => {
    try {
      const soldList = await fetchSoldProperties()
      soldProperties.value = Array.isArray(soldList) ? soldList : []
    } catch (err) {
      console.error('매각 완료 매물 불러오기 실패:', err)
    }
  }

  return {
    soldProperties,
    setSoldProperties,
    userProperties,
    loadUserProperties,
    loadSoldProperties,
  }
})
