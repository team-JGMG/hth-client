<template>
  <div class="p-2 bg-black text-white rounded-b-lg flex flex-col">
    <div class="mb-2">
      <div class="flex items-center bg-white rounded-md px-3 py-2">
        <input
          type="number"
          v-model.number="amount"
          class="min-w-0 w-full bg-transparent outline-none text-black text-lg px-0"
        />
        <BaseTypography weight="medium" class="text-black text-lg ml-1 mr-1">원</BaseTypography>
        <button
          @click="decrementAmount"
          class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xl font-bold my-1"
        >
          <span class="material-symbols-outlined"> remove </span>
        </button>
        <button
          @click="incrementAmount"
          class="bg-gray-300 active:bg-gray-600 text-white rounded-full w-7 h-7 flex items-center justify-center ml-2 text-xl font-bold"
        >
          <span class="material-symbols-outlined"> add </span>
        </button>
      </div>
    </div>

    <div class="mb-8">
      <div class="flex items-center bg-white rounded-md px-3 py-2">
        <input
          type="number"
          v-model.number="quantity"
          class="flex-grow bg-transparent outline-none text-black text-lg"
          placeholder="0주"
        />
        <BaseTypography weight="medium" class="text-black text-lg mr-0">주</BaseTypography>
        <button
          @click="decrementQuantity"
          class="bg-gray-300 hover:bg-gray-600 text-white rounded-full w-7 h-7 my-1 flex items-center justify-center text-xl font-bold"
        >
          <span class="material-symbols-outlined"> remove </span>
        </button>
        <button
          @click="incrementQuantity"
          class="bg-gray-300 hover:bg-gray-600 text-white rounded-full w-7 h-7 flex items-center justify-center ml-2 text-xl font-bold"
        >
          <span class="material-symbols-outlined"> add </span>
        </button>
      </div>
    </div>

    <div class="mt-auto flex justify-center">
      <CompletedButton
        type="button"
        color="red-600"
        textColor="white"
        typographySize="base"
        typographyWeight="bold"
        customClass="rounded-md w-48 py-3"
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
