<script setup>
import { ref } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import TradeForm from './TradeForm.vue'
import { getOrderBookByFundingId } from '@/api/orderbook'

const props = defineProps({
  fundingId: { type: Number, required: true },
})

const emit = defineEmits(['trade-completed'])

const isOpen = ref(false)
const activeMode = ref('buy')
const currentPrice = ref(0)

const fetchCurrentPrice = async () => {
  try {
    const res = await getOrderBookByFundingId(Number(props.fundingId))
    currentPrice.value = res?.data?.data?.currentPrice ?? 0
  } catch {
    currentPrice.value = 0
  }
}

const toggleOpen = async () => {
  if (!isOpen.value) {
    await fetchCurrentPrice()
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

const setActiveMode = async (mode) => {
  activeMode.value = mode
  if (isOpen.value && mode === 'buy') {
    await fetchCurrentPrice()
  }
}

const handleTradeCompleted = () => {
  isOpen.value = false
  emit('trade-completed')
}
</script>

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
        >expand_less</span
      >
    </div>

    <transition name="slide-up">
      <div v-if="isOpen" class="p-4 pt-0 bg-black text-white">
        <TradeForm
          :type="activeMode"
          :fundingId="props.fundingId"
          :isOpen="isOpen"
          :initial-price="currentPrice"
          @completed="handleTradeCompleted"
        />
        <div class="mb-18"></div>
      </div>
    </transition>
  </div>
</template>
