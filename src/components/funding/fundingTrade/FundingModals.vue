<template>
  <!-- 확인 모달 -->
  <BaseModal :isOpen="showConfirm" @close="$emit('closeConfirm')">
    <template #default>
      <div class="p-4 pb-0">
        <BaseTypography class="mb-4" size="xl" weight="bold">
          선택하신 수량으로 펀딩을 진행하시겠습니까?
        </BaseTypography>
        <BaseTypography size="base" color="gray-1" class="text-start mb-0">
          <br />주당 가격: {{ formatNumber(item.shareAmount) }}원/주 <br />구매 수량:
          {{ formatNumber(quantity) }}주 <br />총 펀딩금액: {{ formatNumber(totalPrice) }}원
          <br />예상 잔여 포인트: {{ formatNumber(Number(item.userPoints ?? 0) - totalPrice) }}원
        </BaseTypography>
      </div>
    </template>
    <template #submit>
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold"
        @click="$emit('finalSubmit')"
      >
        펀딩하기
      </CompletedButton>
    </template>
  </BaseModal>

  <!-- 완료 모달 -->
  <CompletedModal :is-open="showComplete" @close="$emit('closeComplete')" @submit="goToMyPage">
    펀딩이 완료되었습니다.
    <template #submitText>닫기</template>
  </CompletedModal>

  <!-- 충전 모달 -->
  <BaseModal :isOpen="showCharge" @close="$emit('closeCharge')" @submit="$emit('chargeSubmit')">
    <PointChargeModal
      :model-value="chargeAmount"
      @update:model-value="$emit('update:chargeAmount', $event)"
    />
    <template #submit><BaseTypography color="white">충전하기</BaseTypography></template>
  </BaseModal>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import CompletedModal from '@/components/common/Modal/CompletedModal.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import PointChargeModal from '@/components/main/PointSection/PointModal/PointChargeModal.vue'

defineProps({
  showConfirm: Boolean,
  showComplete: Boolean,
  showCharge: Boolean,
  item: Object,
  quantity: Number,
  totalPrice: Number,
  chargeAmount: Number,
  isStepValid: Boolean,
})

defineEmits([
  'closeConfirm',
  'closeComplete',
  'closeCharge',
  'finalSubmit',
  'chargeSubmit',
  'update:chargeAmount',
])

const router = useRouter()

const formatNumber = (num) => {
  const number = Number(num)
  return Number.isNaN(number) ? '0' : number.toLocaleString()
}

const goToMyPage = () => {
  router.push('/account/my-page/investments')
}
</script>
