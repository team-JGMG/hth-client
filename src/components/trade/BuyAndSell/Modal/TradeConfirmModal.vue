<script setup>
import axios from 'axios'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { computed } from 'vue'
// import { useUserStore } from '@/stores/user'

const props = defineProps({
  type: String, // 'buy' or 'sell'
  amount: Number,
  quantity: Number,
  isOpen: Boolean,
  fundingId: Number, // 추가로 펀딩 ID도 받아야 함
})

const total = computed(() => props.amount * props.quantity)
// const userStore = useUserStore()

const emit = defineEmits(['close', 'completed'])

const handleConfirm = async () => {
  try {
    const response = await axios.post('/api/orders', {
      // userId: userStore.userId,
      userId: 1,
      fundingId: props.fundingId,
      orderPricePerShare: props.amount,
      orderShareCount: props.quantity,
      orderType: props.type.toUpperCase(),
    })

    console.log('✅ 주문 성공:', response.data)

    emit('completed')
    emit('close')
  } catch (error) {
    console.error('❌ 주문 실패:', error)
    alert(error?.response?.data?.message || '주문 중 오류가 발생했습니다.')
  }
}
</script>

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
        예상 잔여 포인트: 50,000원
      </BaseTypography>
    </div>

    <template #submit>
      <button @click="handleConfirm" class="w-full bg-black text-white py-3 rounded-xl mt-6">
        {{ type === 'buy' ? '구매' : '판매' }}하기
      </button>
    </template>
  </BaseModal>
</template>
