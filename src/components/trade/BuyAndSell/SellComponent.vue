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
          <button
            @click="decrementAmount"
            class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold flex-shrink-0"
          >
            <span class="material-symbols-outlined"> remove </span>
          </button>
          <button
            @click="incrementAmount"
            class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold flex-shrink-0"
          >
            <span class="material-symbols-outlined"> add </span>
          </button>
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
          <button
            @click="decrementQuantity"
            class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold flex-shrink-0"
          >
            <span class="material-symbols-outlined"> remove </span>
          </button>
          <button
            @click="incrementQuantity"
            class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold flex-shrink-0"
          >
            <span class="material-symbols-outlined"> add </span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-auto flex justify-center">
      <CompletedButton
        type="button"
        color="red-600"
        textColor="white"
        typographySize="base"
        typographyWeight="bold"
        customClass="rounded-md w-36 py-3"
        @click="handlePurchase"
      >
        구매하기
      </CompletedButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const amount = ref(0)
const quantity = ref(0)

const incrementAmount = () => {
  amount.value += 10
}
const decrementAmount = () => {
  if (amount.value >= 10) {
    amount.value -= 10
  } else {
    amount.value = 0
  }
}

const incrementQuantity = () => {
  quantity.value += 1
}
const decrementQuantity = () => {
  if (quantity.value >= 1) {
    quantity.value -= 1
  } else {
    quantity.value = 0
  }
}

const handlePurchase = () => {}
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
