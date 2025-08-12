<template>
  <div>
    <BaseTypography class="text-xl mb-1" color="white"> {{ userName }}님, </BaseTypography>
    <div class="mb-4 flex items-baseline justify-between">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">
        {{ formattedPoint }}
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  userName: { type: String, default: '???' },
  point: { type: [Number, String, null], default: null },
  loading: { type: Boolean, default: false },
})

const normalizedPoint = computed(() => {
  const v = props.point
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number') return Number.isFinite(v) && v >= 0 ? v : null
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^\d.-]/g, ''))
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
})

// 마지막 정상값 저장
const lastStablePoint = ref(null)
watch(
  normalizedPoint,
  (val) => {
    if (val !== null) {
      lastStablePoint.value = val
    }
  },
  { immediate: true },
)

// 표시할 값: 현재값 없으면 마지막 값
const formattedPoint = computed(() => {
  const n = normalizedPoint.value ?? lastStablePoint.value
  return n != null ? n.toLocaleString() + '원' : ''
})
</script>
