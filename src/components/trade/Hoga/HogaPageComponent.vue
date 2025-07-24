<script setup>
import { ref, nextTick } from 'vue'
import AskingPriceComponent from './AskingPriceComponent.vue'

const scrollContainer = ref(null)

const handleCenterIndex = (index) => {
  nextTick(() => {
    if (scrollContainer.value) {
      const rowHeight = 60
      const containerHeight = scrollContainer.value.clientHeight
      const scrollTo = index * rowHeight - containerHeight / 2 + rowHeight / 2
      scrollContainer.value.scrollTop = Math.max(scrollTo, 0)
    }
  })
}
</script>

<template>
  <div ref="scrollContainer" class="h-[400px] overflow-y-auto no-scrollbar">
    <AskingPriceComponent @centerIndex="handleCenterIndex" />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
