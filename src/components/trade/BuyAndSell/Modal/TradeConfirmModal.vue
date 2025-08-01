<template>
  <BaseModal :isOpen="isOpen" @close="$emit('close')">
    <div class="p-4">
      <BaseTypography weight="bold" size="xl" class="text-start mb-4">
        선택하신 수량으로 {{ type === 'buy' ? '구매' : '판매' }}를 <br />
        진행하시겠습니까?
      </BaseTypography>
      <BaseTypography color="gray-1" size="base" class="text-start mb-0">
        주당 가격: {{ amount.toLocaleString() }}원 <br />
        수량: {{ quantity }}주 <br />
        총 금액: {{ total.toLocaleString() }}원 <br />
        <!-- 추후 현재 보유 포인트 +- 계산 -->
        예상 잔여 포인트: 50,000원</BaseTypography
      >
    </div>
    <template #submit>
      <BaseTypography color="white"> {{ type === 'buy' ? '구매' : '판매' }}하기 </BaseTypography>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { computed } from 'vue'

const props = defineProps({
  type: String, // 'buy' or 'sell'
  amount: Number,
  quantity: Number,
  isOpen: Boolean,
})

const total = computed(() => props.amount * props.quantity)
</script>
