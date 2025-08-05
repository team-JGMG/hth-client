// stores/propertyadmin.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPropertyList, fetchPropertyDetail } from '@/api/admin'

export const usePropertyAdmin = defineStore('propertyAdmin', () => {
  const propertyList = ref([])
  const selectedProperty = ref(null)
  const hasNext = ref(false)

  const getPropertyList = async (category, page = 0, size = 10) => {
    const { content, hasNext: next } = await fetchPropertyList(category, page, size)
    propertyList.value = content
    hasNext.value = next
  }

  const getPropertyDetail = async (id) => {
    const data = await fetchPropertyDetail(id)
    selectedProperty.value = data
    return data
  }

  return {
    propertyList,
    hasNext,
    selectedProperty,
    getPropertyList,
    getPropertyDetail,
  }
})
