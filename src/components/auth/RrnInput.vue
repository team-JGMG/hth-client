//RrnInput.vue
<script setup>
import { ref, computed, watch } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  rrnFront: String,
  rrnBack: String,
})

const emit = defineEmits(['update:rrnFront', 'update:rrnBack'])

// 뒷자리 입력 상태는 내부에서 유지
const rrnBackRaw = ref(props.rrnBack || '')

watch(
  () => props.rrnBack,
  (val) => {
    if (val !== rrnBackRaw.value) {
      rrnBackRaw.value = val
    }
  },
)

// 표시용 마스킹 문자열 (첫 글자만 보이고 나머지는 • 처리)
const displayValue = computed(() => {
  if (!rrnBackRaw.value) return ''
  return rrnBackRaw.value
    .split('')
    .map((char, idx) => (idx === 0 ? char : '•'))
    .join('')
})

// 입력 핸들러: 숫자만 필터링하고 최대 7자리 유지
const handleMaskedInput = (e) => {
  const rawInput = e.target.value.replace(/\D/g, '').slice(0, 7)
  rrnBackRaw.value = rawInput
  emit('update:rrnBack', rrnBackRaw.value)
}

// 유효성 검사
const isFrontValid = computed(() => /^\d{6}$/.test(props.rrnFront))
const isBackValid = computed(() => /^\d{7}$/.test(rrnBackRaw.value))
const isInvalid = computed(() => {
  return (
    (props.rrnFront !== '' && !isFrontValid.value) ||
    (rrnBackRaw.value !== '' && !isBackValid.value)
  )
})
</script>

<template>
  <div class="w-full">
    <BaseTypography class="block text-base font-medium mb-2">주민등록번호</BaseTypography>

    <div class="flex items-center gap-2">
      <!-- 앞자리 -->
      <div class="flex-1">
        <input
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="앞 6자리"
          class="w-full border-b border-gray-300 focus:outline-none focus:border-black p-2 text-base"
          :value="props.rrnFront"
          @input="(e) => emit('update:rrnFront', e.target.value.replace(/\D/g, '').slice(0, 6))"
        />
      </div>

      <!-- 구분자 -->
      <!-- <span class="material-symbols-outlined text-xs">remove</span> -->
      <p class="text-base">-</p>

      <!-- 뒷자리 (마스킹된 값과 실제 입력 분리) -->
      <div class="flex-1 relative">
        <!-- 마스킹 표시 -->
        <div
          class="absolute w-full inset-0 px-1 py-2 text-base tracking-widest pointer-events-none text-black"
        >
          {{ displayValue }}
        </div>

        <!-- 실제 입력 필드 -->
        <input
          type="text"
          inputmode="numeric"
          maxlength="7"
          placeholder="뒤 7자리"
          class="w-full border-b border-gray-300 focus:outline-none focus:border-black p-2 tracking-widest text-transparent caret-black bg-transparent text-base"
          :value="rrnBackRaw"
          @input="handleMaskedInput"
        />
      </div>
    </div>

    <BaseTypography
      v-show="isInvalid"
      color="red-1"
      size="xs"
      class="absolute mt-2 left-0 top-full"
    >
      * 정확한 주민등록번호를 입력해주세요.
    </BaseTypography>
  </div>
</template>
//백에 보낼떄는 앞,뒤자리 합쳐서 보내야함.
