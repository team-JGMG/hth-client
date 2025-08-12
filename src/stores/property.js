import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchUserProperties } from '@/api/property' // 이 줄만 추가로 필요
export const usePropertyStore = defineStore('property', () => {
  const soldProperties = ref([]) // 매각 완료된 매물 목록
  const userProperties = ref([]) // 전체 사용자 매물 목록

  function setSoldProperties(properties) {
    soldProperties.value = properties
  }
  const loadUserProperties = async () => {
    try {
      const propertyList = await fetchUserProperties() // ✅ 배열로 바로 받기
      console.log('✅ API 응답:', propertyList)
      userProperties.value = propertyList
      soldProperties.value = propertyList.filter((item) => item.status === 'COMPLETED')
    } catch (error) {
      console.error('❌ 매물 조회 실패:', error)
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
