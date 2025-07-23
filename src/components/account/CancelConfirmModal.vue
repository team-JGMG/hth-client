<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div @click.stop class="max-w-[340px] w-full bg-white rounded-lg p-6 relative">
        <!-- 닫기 버튼 -->
        <button
          type="button"
          aria-label="닫기"
          @click="emit('close')"
          class="absolute top-4 right-4"
        >
          <span
            class="material-symbols-outlined text-[#838a9a] text-sm w-4 h-4 flex items-center justify-center"
          >
            close
          </span>
        </button>

        <!-- 제목 -->
        <div class="text-base font-bold mb-3">정말 취소하시겠습니까?</div>

        <!-- 본문 안내 -->
        <div class="text-sm text-gray-500 leading-relaxed">
          취소 시 참여 금액은 포인트로 환불되며,<br />
          다른 ‘반의반집’ 매물로 새로운 투자를 시작할 수 있습니다.
        </div>

        <!-- 제출 버튼 -->
        <button
          class="block w-full h-12 bg-[#ff3b3b] text-white rounded-lg flex items-center justify-center mx-auto mt-8"
          type="button"
          aria-label="제출"
          @click="emit('submit')"
        >
          <span class="text-white font-medium text-base">취소하기</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['close', 'submit'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>
