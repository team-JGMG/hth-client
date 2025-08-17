<script setup>
import BaseButton from '../common/Button/BaseButton.vue'
import BaseTypography from '../common/Typography/BaseTypography.vue'

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: '정말 취소하시겠습니까?',
  },
  description: {
    type: String,
    default:
      '취소 시 참여 금액은 포인트로 환불되며,<br />다른 ‘반의반집’ 매물로 새로운 투자를 시작할 수 있습니다.',
  },
  buttonText: {
    type: String,
    default: '취소하기',
  },
})

const { title, description, buttonText } = props

const emit = defineEmits(['close', 'submit'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div @click.stop class="max-w-[327px] w-full bg-white rounded-xl px-6 py-7 relative">
        <button
          type="button"
          aria-label="닫기"
          @click="emit('close')"
          class="absolute top-4 right-4"
        >
          <span
            class="material-symbols-outlined"
            style="
              font-size: 1rem;
              color: #838a9a;
              width: 1rem;
              height: 1rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
          >
            close
          </span>
        </button>

        <BaseTypography size="lg" weight="bold" class="text-left mb-3">
          {{ title }}
        </BaseTypography>

        <div class="text-center">
          <BaseTypography size="sm" color="gray-1" class="leading-relaxed mb-6 break-keep">
            <span v-html="description" />
          </BaseTypography>
        </div>

        <BaseButton
          type="button"
          aria-label="제출"
          variant="danger"
          @click="emit('submit')"
          class="block w-full h-12 bg-[#ff3b3b] text-white rounded-lg flex items-center justify-center mx-auto mt-7"
        >
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </Teleport>
</template>
