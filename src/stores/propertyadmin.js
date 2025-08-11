// stores/propertyadmin.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPropertyList, fetchPropertyDetail } from '@/api/admin'

export const usePropertyAdmin = defineStore('propertyAdmin', () => {
  const propertyList = ref([])
  const selectedProperty = ref(null)
  const hasNext = ref(true)
  const page = ref(0)
  const size = 5

  const getPropertyList = async (category) => {
    if (!hasNext.value) return

    try {
      const responseData = await fetchPropertyList(category, page.value, size)

      if (responseData && responseData.content && Array.isArray(responseData.content)) {
        propertyList.value.push(...responseData.content)
        hasNext.value = !responseData.last
        page.value += 1
      } else {
        console.warn('Received malformed data or empty content, stopping pagination.')
        hasNext.value = false
      }
    } catch (error) {
      console.error('Failed to fetch property list:', error)
      hasNext.value = false // Stop trying on error
    }
  }

  const resetList = () => {
    propertyList.value = []
    page.value = 0
    hasNext.value = true
  }

  const getPropertyDetail = async (id) => {
    const data = await fetchPropertyDetail(id)
    selectedProperty.value = data
    return data
  }

  return {
    propertyList,
    hasNext,
    page,
    selectedProperty,
    getPropertyList,
    getPropertyDetail,
    resetList,
  }
})
