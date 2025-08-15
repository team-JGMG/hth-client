<template>
  <div ref="scrollContainer" class="overflow-y-auto no-scrollbar w-full">
    <AskingPriceComponent
      v-if="parsedData"
      :parsedData="parsedData"
      @centerIndex="handleCenterIndex"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import AskingPriceComponent from './AskingPriceComponent.vue'

defineProps({
  parsedData: {
    type: Object,
    default: null,
  },
})

const scrollContainer = ref(null)

const handleCenterIndex = (index, prices) => {
  nextTick(() => {
    if (!scrollContainer.value) return
    const containerHeight = scrollContainer.value.clientHeight
    const rowHeight = containerHeight / prices.length
    const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
    scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
  })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
