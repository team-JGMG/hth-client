<!-- src/components/form/CurrencyInput.vue -->
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: '',
  },
  label: String,
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const el = ref(null)
const display = ref('') // 화면에 표시되는 값(콤마 포함)

// --- Helpers ---
const unformat = (v) => (v || '').toString().replace(/[^\d]/g, '') // 숫자만
const normalize = (digits) => {
  // 선행 0 제거 (단, 빈 문자열/0은 '0'으로 보지 않고 '' 유지)
  if (!digits) return ''
  const n = digits.replace(/^0+/, '')
  return n === '' ? '0' : n
}
const format = (digits) => {
  if (digits === '') return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const setCaretByDigits = (input, digitsTarget) => {
  // digitsTarget(좌측에 있는 '숫자' 갯수)을 기준으로 캐럿 위치 복원
  const val = input.value
  let seen = 0
  let pos = 0
  for (; pos < val.length; pos++) {
    if (/\d/.test(val[pos])) seen++
    if (seen >= digitsTarget) break
  }
  const finalPos = Math.min(pos + 1, val.length)
  input.setSelectionRange(finalPos, finalPos)
}

const countDigitsLeft = (text, caret) => {
  let c = 0
  for (let i = 0; i < Math.min(text.length, caret); i++) {
    if (/\d/.test(text[i])) c++
  }
  return c
}

// --- Core formatting / emitting ---
const applyAndEmit = (raw, caretDigits = null) => {
  const digits = normalize(unformat(raw))
  const pretty = format(digits)
  display.value = pretty

  // 부모로는 '콤마 없는' 숫자 전달 (빈 입력은 빈 문자열로)
  emit('update:modelValue', digits === '0' && raw === '' ? '' : digits)

  // 캐럿 복원
  nextTick(() => {
    if (el.value && caretDigits != null) {
      setCaretByDigits(el.value, caretDigits)
    }
  })
}

// --- Lifecycle / watchers ---
onMounted(() => {
  const initDigits = normalize(unformat(props.modelValue ?? ''))
  display.value = format(initDigits)
})

watch(
  () => props.modelValue,
  (nv) => {
    // 외부에서 값이 바뀌는 경우에도 동기화(수정 화면 초기값 등)
    const digits = normalize(unformat(nv ?? ''))
    const pretty = format(digits)
    if (pretty !== display.value) display.value = pretty
  },
)

// --- DOM event handlers ---
const handleInput = (e) => {
  const input = e.target
  const caretDigitsBefore = countDigitsLeft(input.value, input.selectionStart)
  applyAndEmit(input.value, caretDigitsBefore)
}

const handleKeyDown = (e) => {
  // 음수/소수점/문자 입력 차단
  // 단, Backspace/Delete/화살표/탭 등은 허용
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Home',
    'End',
  ]
  if (allowedKeys.includes(e.key)) return

  // 숫자만 허용
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}

const handlePaste = async (e) => {
  e.preventDefault()
  const text = (e.clipboardData || window.clipboardData).getData('text') || ''
  const digits = unformat(text)
  const input = e.target
  // 현재 커서 앞의 숫자 개수
  const caretDigitsBefore = countDigitsLeft(input.value, input.selectionStart)
  // 입력값에 붙여넣은 숫자를 반영(자연스럽게 붙인 효과를 위해, 기존 숫자열에 병합하는 대신 전체 재계산)
  const nextRaw = format(normalize(unformat(display.value + digits)))
  applyAndEmit(nextRaw, caretDigitsBefore + digits.length)
}

const handleFocus = () => emit('focus')
const handleBlur = () => {
  // 블러 시 최종 정규화(선행 0 처리)
  const digits = normalize(unformat(display.value))
  display.value = format(digits)
  emit('blur')
}
</script>

<template>
  <div class="mb-5">
    <label v-if="label" class="block text-base font-medium mb-1">{{ label }}</label>
    <input
      ref="el"
      :value="display"
      @input="handleInput"
      @keydown="handleKeyDown"
      @paste="handlePaste"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      class="w-full border-b border-gray-300 focus:outline-none focus:border-red-400 p-2 text-base"
      inputmode="numeric"
      autocomplete="off"
      aria-label="금액 입력"
    />
  </div>
</template>
