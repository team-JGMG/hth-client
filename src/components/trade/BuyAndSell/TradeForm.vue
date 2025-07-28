<template>
  <div class="p-4 bg-black text-white rounded-b-lg flex flex-col">
    <div class="mb-2">
      <div class="relative bg-white rounded-md px-3 py-2 flex items-center">
        <input
          type="number"
          v-model.number="amount"
          class="flex-1 bg-transparent outline-none text-black text-lg min-w-0"
          placeholder="0원"
        />
        <div class="flex items-center gap-x-1 ml-2 flex-shrink-0">
          <BaseTypography weight="medium" class="text-black text-lg">원</BaseTypography>
          <button @click="decrementAmount" class="btn-circle">－</button>
          <button @click="incrementAmount" class="btn-circle">＋</button>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="relative bg-white rounded-md px-3 py-2 flex items-center">
        <input
          type="number"
          v-model.number="quantity"
          class="flex-1 bg-transparent outline-none text-black text-lg min-w-0"
          placeholder="0주"
        />
        <div class="flex items-center gap-x-1 ml-2 flex-shrink-0">
          <BaseTypography weight="medium" class="text-black text-lg">주</BaseTypography>
          <button @click="decrementQuantity" class="btn-circle">－</button>
          <button @click="incrementQuantity" class="btn-circle">＋</button>
        </div>
      </div>
    </div>

    <div class="mt-auto flex justify-center">
      <CompletedButton
        type="button"
        :color="buttonColor"
        textColor="white"
        typographySize="base"
        typographyWeight="bold"
        customClass="rounded-md w-36 py-3"
        @click="openConfirmModal"
      >
        {{ buttonText }}
      </CompletedButton>
    </div>

    <TradeConfirmModal
      :type="props.type"
      :amount="amount"
      :quantity="quantity"
      :isOpen="isConfirmOpen"
      @close="isConfirmOpen = false"
      @confirm="confirmTrade"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import TradeConfirmModal from './Modal/TradeConfirmModal.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'buy',
  },
})

const amount = ref(0)
const quantity = ref(0)
const isConfirmOpen = ref(false)

const incrementAmount = () => (amount.value += 10)
const decrementAmount = () => (amount.value = Math.max(0, amount.value - 10))
const incrementQuantity = () => (quantity.value += 1)
const decrementQuantity = () => (quantity.value = Math.max(0, quantity.value - 1))

const openConfirmModal = () => {
  isConfirmOpen.value = true
}

const confirmTrade = () => {
  console.log(`${props.type === 'buy' ? '구매' : '판매'} 요청`, {
    amount: amount.value,
    quantity: quantity.value,
    total: amount.value * quantity.value,
  })
  isConfirmOpen.value = false
}

const buttonText = computed(() => (props.type === 'buy' ? '구매하기' : '판매하기'))
const buttonColor = computed(() => (props.type === 'buy' ? 'red-600' : 'blue-600'))
</script>

<style scoped>
.btn-circle {
  background-color: #d1d5db;
  color: white;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
