<template>
  <component
    :is="tag"
    :class="['text-' + color, 'font-' + weight, 'fs-' + size, 'fw-' + weight]"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/common/styles'
import { defineProps } from 'vue'

defineProps({
  /**
   * @type {string}
   * @description 타입그래피 태그
   * @param {string} tag - 가능한 속성: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
   */
  tag: {
    type: String,
    default: 'p',
    validator: (value) => {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(value)
    },
  },
  /**
   * @type {string}
   * @description 타입그래피 색상
   * @param {string} color - 가능한 속성: 'black', 'white', 'gray', 'gray-1', 'red', 'blue', 'lightblue', 'primary', 'secondary', 'dark'
   */
  color: {
    type: String,
    default: 'black',
    validator: (value) => {
      return COLORS.includes(value)
    },
  },
  /**
   * @type {string}
   * @description 타입그래피 두께
   * @param {string} weight - 가능한 속성: 'regular', 'medium', 'bold', 'black'
   */
  weight: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return FONT_WEIGHTS.includes(value)
    },
  },
  /**
   * @type {string}
   * @description 타입그래피 크기
   * @param {string} size - 가능한 속성: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => {
      return FONT_SIZES.includes(value)
    },
  },
})
</script>
