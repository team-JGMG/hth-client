import { defineStore } from 'pinia'
import axios from 'axios'

export const useSoldPropertyStore = defineStore('soldProperty', {
  state: () => ({
    properties: [],
  }),
  actions: {
    async fetchSoldProperties() {
      try {
        const response = await axios.get('https://half-to-half.site/api/property/sold')
        this.properties = response.data.data
      } catch (error) {
        console.error('매각 완료 매물 목록 조회 실패:', error)
      }
    },
  },
})
