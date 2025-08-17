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
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/common/styles'

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

const CUSTOM_HEX_COLORS = {
  primary: '#4EB5B5',
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

  if (isTailwindBaseColor(props.color)) {
    classes.push('text-' + props.color)
  }

  classes.push('text-' + props.size)

  return classes
})

const computedInlineStyle = computed(() => {
  const style = {}

  if (CUSTOM_HEX_COLORS[props.color]) {
    style.color = CUSTOM_HEX_COLORS[props.color]
  }

  if (FONT_WEIGHT_MAP[props.weight]) {
    style.fontWeight = FONT_WEIGHT_MAP[props.weight]
  }

  return style
})
</script>
