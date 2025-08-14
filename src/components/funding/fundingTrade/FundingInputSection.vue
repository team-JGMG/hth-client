<template>
  <div>
    <!-- 주당 가격 표시 -->
    <div class="flex justify-between items-center text-sm text-black font-medium mb-4">
      <BaseTypography size="base" weight="medium" class="px-2">주당 가격</BaseTypography>
      <BaseTypography size="base" weight="bold" class="px-2">
        {{ formatNumber(item.shareAmount) }}원/주
      </BaseTypography>
    </div>

    <!-- 빠른 수량 선택 버튼들 -->
    <div class="flex justify-between gap-2 mb-2">
      <BaseButton
        v-for="amount in [1, 10, 50, 100]"
        :key="amount"
        variant="outline"
        class="flex-1 !px-1 !py-2 text-sm md:text-sm !border-gray-300 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition inline-flex items-center justify-center whitespace-nowrap break-keep"
        @click="addShares(amount)"
      >
        +{{ amount }}주
      </BaseButton>
    </div>

    <!-- 수량 입력 필드 -->
    <div class="relative mb-2">
      <input
        ref="quantityInput"
        type="text"
        v-model="displayQuantity"
        @input="handleQuantityInput"
        @blur="handleQuantityBlur"
        @focus="handleQuantityFocus"
        placeholder="구매할 수량(주)을 입력해주세요."
        :class="[
          'w-full h-12 border rounded-[10px] px-6 text-base text-black placeholder:text-gray-500',
          validationState.isError
            ? 'border-red-200 focus:ring-red-300'
            : validationState.isValid
              ? 'border-green-200 focus:ring-green-300'
              : 'border-gray-300 focus:ring-gray-700',
        ]"
      />
      <!-- 유효성 검사 메시지 -->
      <div class="mt-1 min-h-[20px] ml-2">
        <BaseTypography
          v-if="validationState.message"
          size="xs"
          :color="
            validationState.isError ? 'red-1' : validationState.isValid ? 'green-1' : 'gray-2'
          "
        >
          {{ validationState.message }}
        </BaseTypography>
      </div>
    </div>

    <!-- 총 가격 표시 -->
    <div class="w-full h-12 bg-gray-200 rounded-[10px] px-4 flex items-center mb-2">
      <BaseTypography size="base" class="font-semibold">
        ₩ {{ formatNumber(totalPrice) }}
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

const props = defineProps({
  quantity: {
    type: Number,
    default: 0,
  },
  item: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:quantity', 'charge'])

const displayQuantity = ref('')
const quantityInput = ref(null)

// 숫자 포맷팅 함수
const formatNumber = (num) => {
  const number = Number(num)
  return Number.isNaN(number) ? '0' : number.toLocaleString()
}

// 문자열에서 숫자만 추출
const parseNumber = (str) => {
  if (typeof str === 'number') return str
  const cleaned = String(str).replace(/[^\d]/g, '')
  return cleaned === '' ? 0 : Number(cleaned)
}

// 유효성 검사 상태
const validationState = computed(() => {
  const qty = Number(props.quantity)

  // 비어있을 때
  if (qty === 0 && displayQuantity.value === '') {
    return {
      isValid: false,
      isError: false,
      message: '',
    }
  }

  // 음수일 때
  if (qty < 0) {
    return {
      isValid: false,
      isError: true,
      message: '수량은 0보다 큰 값을 입력해주세요.',
    }
  }

  // 잔여 주식보다 많을 때
  if (qty > props.item.remainingShares) {
    return {
      isValid: false,
      isError: true,
      message: `최대 ${formatNumber(props.item.remainingShares)}주까지 구매 가능합니다.`,
    }
  }

  // 포인트 부족할 때
  const totalCost = qty * props.item.shareAmount
  if (totalCost > Number(props.item.userPoints || 0)) {
    return {
      isValid: false,
      isError: true,
      message: '보유 포인트가 부족합니다.',
    }
  }

  // 유효한 경우
  return {
    isValid: true,
    isError: false,
    message: '',
  }
})

const addShares = (n) => {
  const newQuantity = Math.max(0, Number(props.quantity || 0) + n)
  emit('update:quantity', newQuantity)
}

// 수량 입력 핸들러
const handleQuantityInput = (event) => {
  const inputValue = event.target.value
  const numericValue = parseNumber(inputValue)

  emit('update:quantity', numericValue)
  displayQuantity.value = numericValue === 0 ? '' : formatNumber(numericValue)

  // 커서 위치 유지
  nextTick(() => {
    if (quantityInput.value) {
      const cursorPos = quantityInput.value.value.length
      quantityInput.value.setSelectionRange(cursorPos, cursorPos)
    }
  })
}

// 포커스 시 숫자만 표시
const handleQuantityFocus = () => {
  if (props.quantity === 0) {
    displayQuantity.value = ''
  } else {
    displayQuantity.value = String(props.quantity)
  }
}

// 블러 시 콤마 표시
const handleQuantityBlur = () => {
  if (props.quantity === 0) {
    displayQuantity.value = ''
  } else {
    displayQuantity.value = formatNumber(props.quantity)
  }
}

// props.quantity 변경 감지
watch(
  () => props.quantity,
  (newVal) => {
    if (newVal === 0) {
      displayQuantity.value = ''
    } else {
      displayQuantity.value = formatNumber(newVal)
    }
  },
)
</script>
