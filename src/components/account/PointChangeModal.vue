<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div @click.stop class="w-[45vw] h-[39vw] bg-white rounded-xl p-6 relative">
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
          <span class="text-lg">－</span> 포인트 환급하기
        </h2>

        <!-- 설명 -->
        <p class="text-sm text-gray-600 mb-4">환급하실 금액을 입력해주세요.</p>

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

        <!-- 계좌 정보 -->
        <div class="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 mb-2">
          국민은행 000000-00-000000 (이채땡)
        </div>

        <!-- 안내 문구 -->
        <p class="text-[8px] text-red-500 text-center leading-snug -mt-2 py-2">
          환급 신청은 영업일 기준 1~2일 이내에 처리됩니다.<br />
          환급 시 소정의 수수료가 부과될 수 있습니다.
        </p>

        <!-- 버튼 -->
        <button
          @click="$emit('submit', amount)"
          class="w-full h-12 rounded-md bg-black text-white font-semibold"
        >
          환급 신청하기
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
