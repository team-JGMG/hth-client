<template>
  <div class="bg-black text-white p-4 rounded-lg shadow relative">
    <!-- 유저 이름 & 포인트 라벨 -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <p class="text-xl font-bold">이채빵님,</p>
        <p class="text-lg">보유 포인트</p>
      </div>

      <div class="flex flex-col items-end">
        <button class="bg-[#2E3548] px-3 py-1 rounded-md mb-1">
          <span class="text-xs font-semibold text-white">정보 수정</span>
        </button>
        <p class="text-2xl font-bold text-white">60,000원</p>
      </div>
    </div>

    <!-- 포인트 버튼들 -->
    <div class="flex space-x-3">
      <button
        class="flex-1 bg-green-400 text-black rounded-xl font-medium py-2"
        @click="isChargeModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">add</span>
        <br />
        <span class="font-extrabold">포인트 충전</span>
      </button>
      <button
        class="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-medium"
        @click="isWithdrawModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">remove</span>
        <br />
        <span class="font-extrabold">포인트 환급</span>
      </button>
    </div>

    <!-- 연결된 모달 컴포넌트들 -->
    <PointChargeModal
      :isOpen="isChargeModalOpen"
      @close="isChargeModalOpen = false"
      @submit="handleCharge"
    />
    <PointChangeModal
      :isOpen="isWithdrawModalOpen"
      @close="isWithdrawModalOpen = false"
      @submit="handleWithdraw"
    />
  </div>
</template>

<script setup>
const isChargeModalOpen = ref(false)
const isWithdrawModalOpen = ref(false)

const handleCharge = (amount) => {
  console.log('충전 금액:', amount)
  isChargeModalOpen.value = false
}
const handleWithdraw = (amount) => {
  console.log('환급 금액:', amount)
  isWithdrawModalOpen.value = false
}
import { ref } from 'vue'
import PointChargeModal from '@/components/account/PointChargeModal.vue'
import PointChangeModal from '@/components/account/PointChangeModal.vue'
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
}
</style>
