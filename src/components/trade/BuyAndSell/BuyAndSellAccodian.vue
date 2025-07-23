<template>
  <div
    class="bg-white overflow-hidden shadow-up"
    :class="isOpen ? 'rounded-t-3xl' : 'rounded-t-3xl'"
  >
    <div
      class="p-4 cursor-pointer flex justify-between items-center w-full bg-[#010101]"
      @click="toggleOpen"
    >
      <div class="text-base font-bold">
        <BaseTypography
          tag="span"
          size="xl"
          weight="bold"
          class="cursor-pointer mr-4 ml-3"
          :color="activeMode === 'buy' ? 'red' : 'white'"
          @click.stop="setActiveMode('buy')"
        >
          구매할래요
        </BaseTypography>
        <BaseTypography
          tag="span"
          size="xl"
          weight="bold"
          class="cursor-pointer"
          :color="activeMode === 'sell' ? 'blue' : 'white'"
          @click.stop="setActiveMode('sell')"
        >
          판매할래요
        </BaseTypography>
      </div>
      <span
        class="material-symbols-outlined text-white transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        expand_less
      </span>
    </div>

    <transition>
      <div v-if="isOpen" class="p-4 pt-0 bg-black text-white">
        <component :is="activePanelComponent" />
        <div class="mb-18"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue' // Adjust path as needed
import BuyComponent from './BuyComponent.vue'
import SellComponent from './SellComponent.vue'

const isOpen = ref(false)
const activeMode = ref('buy')

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const setActiveMode = (mode) => {
  activeMode.value = mode
}

const activePanelComponent = computed(() => {
  return activeMode.value === 'buy' ? BuyComponent : SellComponent
})

onMounted(() => {
  // No direct call needed here as computed property handles initial rendering
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.shadow-up {
  box-shadow: 0 -4px 5px rgba(81, 81, 81, 0.5);
}
</style>
