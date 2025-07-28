<template>
  <div class="relative mb-4">
    <div>
      <BaseTypography class="text-xl mb-1" color="white">
        {{ userStore.userName ? `${userStore.userName}님,` : '???님,' }}
      </BaseTypography>

      <!-- 이 컴포넌트 가져다가 slot부분에 정보수정 버튼 넣으심 됩니다 -->
      <div class="absolute top-0 right-0">
        <slot></slot>
      </div>

      <div class="mb-4 flex items-baseline justify-between">
        <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
        <BaseTypography class="text-xl font-medium" color="white">
          {{ userStore.userPoints.toLocaleString() }}원
        </BaseTypography>
      </div>
    </div>

    <div class="flex space-x-3 mb-3">
      <button
        class="flex-1 bg-green-400 text-black py-2 rounded-xl font-medium"
        @click="isChargeModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">add</span>
        <br />
        <BaseTypography class="font-bold">포인트 충전</BaseTypography>
      </button>
      <button
        class="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-medium"
        @click="isRefundModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">remove</span><br />
        <BaseTypography class="font-bold">포인트 환급</BaseTypography>
      </button>
    </div>

    <BaseCard class="h-6 flex justify-between items-center px-6">
      <BaseTypography class="font-medium">포인트 관리하러 가기</BaseTypography>
      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="myPage"
        aria-label="투자매물 탐색하기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>

    <!-- 충전 모달 -->
    <BaseModal
      :isOpen="isChargeModalOpen"
      @close="isChargeModalOpen = false"
      @submit="console.log('충전')"
    >
      <PointChargeModal />
      <template #submit>
        <BaseTypography color="white"> 충전하기 </BaseTypography>
      </template>
    </BaseModal>

    <!-- 환급 모달 -->
    <BaseModal
      :isOpen="isRefundModalOpen"
      @close="isRefundModalOpen = false"
      @submit="console.log('환급')"
    >
      <PointRefundModal />
      <template #submit>
        <BaseTypography color="white"> 환급 신청하기 </BaseTypography>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import PointChargeModal from './PointModal/PointChargeModel.vue'
import PointRefundModal from './PointModal/PointRefundModal.vue'

const router = useRouter()
const userStore = useUserStore()

// 추후 모달 submit 로직 추가 예정
const isChargeModalOpen = ref(false)
const isRefundModalOpen = ref(false)

const myPage = () => {
  router.push('/account/my-page')
}
</script>
