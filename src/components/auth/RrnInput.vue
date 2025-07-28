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
    <BaseTypography class="block text-sm font-medium mb-2">주민등록번호</BaseTypography>

    <div class="flex items-center gap-1.5">
      <!-- 앞자리 -->
      <input
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="앞 6자리"
        class="w-[127px] border-b border-gray-300 focus:outline-none focus:border-black py-2 px-2 text-sm text-left"
        :value="props.rrnFront"
        @input="(e) => emit('update:rrnFront', e.target.value.replace(/\D/g, '').slice(0, 6))"
      />

      <span class="material-symbols-outlined text-xs">remove</span>

      <!-- 뒷자리 (마스킹된 값과 실제 입력 분리) -->
      <div class="relative w-[147px]">
        <!-- 마스킹 표시 -->
        <div
          class="absolute inset-0 px-2 py-2 text-sm tracking-widest pointer-events-none text-black"
        >
          {{ displayValue }}
        </div>

        <!-- 실제 입력 필드 -->
        <input
          type="text"
          inputmode="numeric"
          maxlength="7"
          placeholder="뒤 7자리"
          class="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2 px-2 text-sm text-left tracking-widest text-transparent caret-black bg-transparent"
          :value="rrnBackRaw"
          @input="handleMaskedInput"
        />
      </div>
    </div>

    <div class="mt-1 min-h-[20px]">
      <BaseTypography
        v-show="isInvalid"
        class="!font-normal text-sm !text-red-500 break-keep leading-snug"
      >
        정확한 주민등록번호를 입력해주세요.
      </BaseTypography>
    </div>
  </div>
</template>
