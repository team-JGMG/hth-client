<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div
        @click.stop
        class="max-w-3xl w-[90%] relative bg-white rounded-lg p-5 box-border /* transform: translate(-50%, -50%)를 적용하는 대신, 부모 flex 컨테이너(`overlay`)에서 `items-center`와 `justify-center`를 사용하여 자식 요소(`modal-container`)를 중앙에 배치했습니다. 이것이 Tailwind에서 가장 흔하고 권장되는 중앙 정렬 방법입니다. */"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['close'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>
