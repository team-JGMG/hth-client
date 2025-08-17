import { fetchPropertyDetail, fetchPropertyList } from '@/api/admin'

import { defineStore } from 'pinia'
import { ref } from 'vue'

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
        hasNext.value = false
      }
    } catch {
      hasNext.value = false
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
