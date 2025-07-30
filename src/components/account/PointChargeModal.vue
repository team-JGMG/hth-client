<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div @click.stop class="w-[45vw] h-[35vw] bg-white rounded-xl p-6 relative">
        <!-- 닫기 버튼 -->
        <button
          type="button"
          aria-label="닫기"
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>

        <!-- 제목 -->
        <h2 class="font-bold text-base mb-2 flex items-center gap-1">
          <span class="text-lg">＋</span> 포인트 충전하기
        </h2>

        <!-- 설명 -->
        <p class="text-sm text-gray-600 mb-4">충전하실 금액을 입력해주세요.</p>

        <!-- 금액 입력 -->
        <div class="flex items-center border-b border-gray-300 pb-1 mb-4">
          <input
            v-model="amount"
            type="number"
            placeholder="금액을 입력해주세요."
            class="flex-1 outline-none text-sm placeholder-gray-400"
          />
          <span class="text-sm text-gray-600">원</span>
        </div>

        <!-- 결제 수단 -->
        <p class="text-sm text-gray-700 mb-1">결제수단</p>
        <div class="w-fit bg-yellow-300 rounded-full px-2 py-0.5 text-sm font-bold text-black mb-4">
          <img src="/src/assets/images/kakao.png" class="w-5 h-5 inline-block mr-1" />
          pay
        </div>

        <!-- 버튼 -->
        <button
          @click="$emit('submit', amount)"
          class="w-full h-12 rounded-md bg-black text-white font-semibold"
        >
          충전하기
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

// const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'submit'])

const amount = ref('')

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>
