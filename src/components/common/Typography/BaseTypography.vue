<template>
  <component
    :is="tag"
    :class="computedTailwindClasses"
    :style="computedInlineStyle"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/common/styles' // FONT_WEIGHTS 사용

const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value) => {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(value)
    },
  },
  color: {
    type: String,
    default: 'black',
    validator: (value) => {
      return COLORS.includes(value)
    },
  },
  weight: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return FONT_WEIGHTS.includes(value)
    },
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => {
      return FONT_SIZES.includes(value)
    },
  },
})

// 커스텀 색상 매핑 (이전 답변에서 사용했던 것과 동일)
const CUSTOM_HEX_COLORS = {
  primary: '#4EB5B5', // 실제 색상 코드로 교체
  secondary: '#YOUR_SECONDARY_HEX',
  dark: '#YOUR_DARK_HEX',
  light: '#YOUR_LIGHT_HEX',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  'gray-1': '#454F5D',
  'gray-2': '#838A9A',
  'gray-3': '#D9D9D9',
  'gray-4': '##EAEDEF',
  'gray-5': '#F5F6F7',
  red: '#FF0000',
  blue: '#0000FF',
  lightblue: '#ADD8E6',
  yellow: '#FFE48A',
  'red-1': '#FC2E6C',
  'purple-1': '#B7A4F5',
  'green-1': '#72C2A8',
}

// 폰트 두께 매핑
const FONT_WEIGHT_MAP = {
  regular: 400,
  medium: 500,
  semibold: 550,
  bold: 600,
  black: 700,
}

const isTailwindBaseColor = (colorName) => {
  const baseColors = [
    'black',
    'white',
    'gray',
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'pink',
    'indigo',
    'teal',
    'cyan',
    'orange',
  ]
  return baseColors.includes(colorName)
}

const computedTailwindClasses = computed(() => {
  const classes = []

  // Tailwind 기본 색상만 text- 접두사와 함께 클래스로 추가
  if (isTailwindBaseColor(props.color)) {
    classes.push('text-' + props.color)
  }

  // size 클래스는 Tailwind 기본 유틸리티이므로 그대로 사용
  classes.push('text-' + props.size) // Tailwind는 'text-sm', 'text-md' 등으로 폰트 크기를 조절

  // fs- 와 fw-는 Tailwind 기본이 아니거나 CDN에 없을 수 있으므로 여기서는 제거
  // 만약 사용하신다면 별도의 CSS 파일에 정의하거나, 인라인 스타일로 처리해야 합니다.
  // classes.push('fs-' + props.size);
  // classes.push('fw-' + props.weight);

  return classes
})

const computedInlineStyle = computed(() => {
  const style = {}

  // 커스텀 색상에 대한 인라인 스타일 적용
  if (CUSTOM_HEX_COLORS[props.color]) {
    style.color = CUSTOM_HEX_COLORS[props.color]
  }

  // 폰트 두께에 대한 인라인 스타일 적용
  if (FONT_WEIGHT_MAP[props.weight]) {
    style.fontWeight = FONT_WEIGHT_MAP[props.weight]
  }

  return style
})
</script>
