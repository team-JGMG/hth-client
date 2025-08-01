import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTradeStore = defineStore('trade', () => {
  const currentPrice = ref(0)
  const upperLimitPrice = ref(0)
  const lowerLimitPrice = ref(0)

  function setTradeData(data) {
    if (data) {
      currentPrice.value = data.currentPrice || 0
      upperLimitPrice.value = data.upperLimitPrice || 0
      lowerLimitPrice.value = data.lowerLimitPrice || 0
    }
  }

  return {
    currentPrice,
    upperLimitPrice,
    lowerLimitPrice,
    setTradeData,
  }
})
