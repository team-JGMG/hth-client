<template>
  <div class="p-4 bg-black text-white rounded-b-lg flex flex-col">
    <!-- 금액 -->
    <div class="mb-2">
      <div class="relative bg-white rounded-md px-3 py-2 flex items-center">
        <input
          type="number"
          v-model.number="amount"
          placeholder="0"
          class="flex-1 bg-transparent outline-none text-black text-lg min-w-0"
          min="0"
        />
        <div class="flex items-center gap-x-1 ml-2 shrink-0">
          <BaseTypography weight="medium" class="text-black text-lg">원</BaseTypography>

          <button
            type="button"
            @click="decrementAmount"
            class="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xl"
            aria-label="감소"
          >
            <span class="material-symbols-outlined text-base leading-none">remove</span>
          </button>

          <button
            type="button"
            @click="incrementAmount"
            class="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xl"
            aria-label="증가"
          >
            <span class="material-symbols-outlined text-base leading-none">add</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 수량 -->
    <div class="mb-8">
      <div class="relative bg-white rounded-md px-3 py-2 flex items-center">
        <input
          type="number"
          v-model.number="quantity"
          placeholder="0"
          class="flex-1 bg-transparent outline-none text-black text-lg min-w-0"
          min="0"
        />
        <div class="flex items-center gap-x-1 ml-2 shrink-0">
          <BaseTypography weight="medium" class="text-black text-lg">주</BaseTypography>

          <button
            type="button"
            @click="decrementQuantity"
            class="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xl"
            aria-label="감소"
          >
            <span class="material-symbols-outlined text-base leading-none">remove</span>
          </button>

          <button
            type="button"
            @click="incrementQuantity"
            class="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xl"
            aria-label="증가"
          >
            <span class="material-symbols-outlined text-base leading-none">add</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 확인 버튼 -->
    <div class="mt-auto flex justify-center">
      <CompletedButton
        type="button"
        :color="buttonColor"
        textColor="white"
        typographySize="base"
        typographyWeight="bold"
        customClass="rounded-md w-36 py-3"
        :disabled="!isLoggedIn"
        :class="!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''"
        @click="openConfirmModal"
        aria-disabled="!isLoggedIn"
      >
        {{ buttonText }}
      </CompletedButton>
    </div>

    <!-- 확인 모달 -->
    <TradeConfirmModal
      :type="props.type"
      :amount="amount"
      :quantity="quantity"
      :isOpen="isConfirmOpen"
      :fundingId="props.fundingId"
      @close="isConfirmOpen = false"
      @completed="handleTradeCompleted"
      @trade-success="handleTradeCompleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import TradeConfirmModal from './Modal/TradeConfirmModal.vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  type: { type: String, default: 'buy' },
  fundingId: { type: Number, required: true },
})

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.getIsLoggedIn === true)

const amount = ref(0)
const quantity = ref(0)
const isConfirmOpen = ref(false)

const incrementAmount = () => (amount.value += 10)
const decrementAmount = () => (amount.value = Math.max(0, amount.value - 10))
const incrementQuantity = () => (quantity.value += 1)
const decrementQuantity = () => (quantity.value = Math.max(0, quantity.value - 1))

const emit = defineEmits(['completed'])

const handleTradeCompleted = () => {
  emit('completed')
}

const openConfirmModal = () => {
  if (!isLoggedIn.value) return
  isConfirmOpen.value = true
}

const buttonText = computed(() => (props.type === 'buy' ? '구매하기' : '판매하기'))
const buttonColor = computed(() => (props.type === 'buy' ? 'red-600' : 'blue-600'))
</script>
