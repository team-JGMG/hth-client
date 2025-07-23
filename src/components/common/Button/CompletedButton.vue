<template>
  <button
    :type="type"
    :class="[
      'w-full rounded-lg p-3 transition-colors',
      `bg-${color}`,
      `active:bg-${activeColor}`,
      customClass,
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <BaseTypography
      :tag="typographyTag"
      :size="typographySize"
      :weight="typographyWeight"
      :color="typographyColor || textColor"
      :class="typographyClass"
    >
      <slot></slot>
    </BaseTypography>
  </button>
</template>

<script setup>
import BaseTypography from '../Typography/BaseTypography.vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  color: { type: String, default: 'black' }, // 버튼 배경색
  textColor: { type: String, default: 'white' }, // 버튼 내부 텍스트 색상
  activeColor: { type: String, default: 'gray-500' }, // 클릭 시 배경색
  disabled: { type: Boolean, default: false },
  customClass: { type: [String, Array, Object], default: '' },
  typographyTag: { type: String, default: 'span' },
  typographySize: { type: String, default: 'base' },
  typographyWeight: { type: String, default: 'medium' },
  typographyColor: { type: String, default: '' },
  typographyClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped></style>
