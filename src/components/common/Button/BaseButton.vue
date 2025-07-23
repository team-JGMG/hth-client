<template>
  <button :class="buttonClass">
    <slot>Button</slot>
  </button>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})

const buttonClass = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-md cursor-pointer mr-2.5 transition-colors'

  const variantClasses = {
    primary: 'bg-blue-500 text-white border-none hover:bg-blue-600',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    pill: 'bg-emerald-500 text-white rounded-full border-none hover:bg-emerald-600',
    secondary: 'bg-gray-500 text-white border-none hover:bg-gray-600',
    success: 'bg-green-500 text-white border-none hover:bg-green-600',
    danger: 'bg-red-500 text-white border-none hover:bg-red-600',
    warning: 'bg-yellow-400 text-black border-none hover:bg-yellow-500',
  }

  return `${baseClasses} ${variantClasses[props.variant] || variantClasses.primary}`
})
</script>

<!-- 사용 예시
<script setup>
import BaseButton from '@/components/BaseButton.vue' // 실제 경로에 맞게 수정
</script>
<template>
   기본 파란색 버튼 -
  <BaseButton>기본 버튼</BaseButton>
  <BaseButton variant="primary">기본 버튼</BaseButton>
  회색 버튼
  <BaseButton variant="secondary">보조 버튼</BaseButton>
  초록색 버튼
  <BaseButton variant="success">성공</BaseButton>
  빨간색 버튼
  <BaseButton variant="danger">위험</BaseButton>
  노란색 버튼
  <BaseButton variant="warning">주의</BaseButton>
  테두리만 있는 버튼
  <BaseButton variant="outline">외곽선 버튼</BaseButton>
  둥근 pill 스타일 버튼
  <BaseButton variant="pill">Pill 버튼</BaseButton>
</template> -->
