<script setup>
import { createOrder } from '@/api/trade'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { computed, watch, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { getPointBalance } from '@/api/point'

const props = defineProps({
  type: String, // 'buy' or 'sell'
  amount: Number,
  quantity: Number,
  isOpen: Boolean,
  fundingId: Number,
})

const total = computed(() => (props.amount || 0) * (props.quantity || 0))
const userStore = useAuthStore()
const toast = useToastStore()

const currentPoint = ref(0)
const expectedBalance = computed(() => currentPoint.value - total.value)

const emit = defineEmits(['close', 'completed', 'trade-success'])

watch(
  () => props.isOpen,
  async (open) => {
    if (open && userStore.userId) {
      try {
        const point = await getPointBalance(userStore.userId)
        currentPoint.value = point || 0
      } catch (e) {
        console.error('포인트 조회 실패:', e)
      }
    }
  },
)

const handleConfirm = async () => {
  try {
    const payload = {
      userId: userStore.userId,
      fundingId: props.fundingId,
      orderPricePerShare: props.amount,
      orderShareCount: props.quantity,
    }

    const response = await createOrder(payload, props.type)

    console.log('✅ 주문 성공:', response.data)
    toast.success({
      title: '주문 완료',
      body: `${props.type === 'buy' ? '구매' : '판매'} 주문이 성공적으로 접수되었습니다.`,
    })
    emit('completed')
    emit('close')
    emit('trade-success')
  } catch (error) {
    console.error('주문 실패:', error)
    toast.error({
      title: '주문 실패',
      body: error?.response?.data?.message || '주문 중 오류가 발생했습니다.',
    })
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
        예상 잔여 포인트:
        <span :class="expectedBalance < 0 ? 'text-red-500' : ''">
          {{ expectedBalance.toLocaleString() }}원
          <span v-if="expectedBalance < 0"> (잔액 부족)</span>
        </span>
      </BaseTypography>
    </div>

    <template #submit>
      <button @click="handleConfirm" class="w-full bg-black text-white rounded-xl mt-0">
        {{ type === 'buy' ? '구매' : '판매' }}하기
      </button>
    </template>
  </BaseModal>
</template>
