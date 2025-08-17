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
const display = ref('')

const unformat = (v) => (v || '').toString().replace(/[^\d]/g, '')
const normalize = (digits) => {
  if (!digits) return ''
  const n = digits.replace(/^0+/, '')
  return n === '' ? '0' : n
}
const format = (digits) => {
  if (digits === '') return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const setCaretByDigits = (input, digitsTarget) => {
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

const applyAndEmit = (raw, caretDigits = null) => {
  const digits = normalize(unformat(raw))
  const pretty = format(digits)
  display.value = pretty

  emit('update:modelValue', digits === '0' && raw === '' ? '' : digits)

  nextTick(() => {
    if (el.value && caretDigits != null) {
      setCaretByDigits(el.value, caretDigits)
    }
  })
}

onMounted(() => {
  const initDigits = normalize(unformat(props.modelValue ?? ''))
  display.value = format(initDigits)
})

watch(
  () => props.modelValue,
  (nv) => {
    const digits = normalize(unformat(nv ?? ''))
    const pretty = format(digits)
    if (pretty !== display.value) display.value = pretty
  },
)

const handleInput = (e) => {
  const input = e.target
  const caretDigitsBefore = countDigitsLeft(input.value, input.selectionStart)
  applyAndEmit(input.value, caretDigitsBefore)
}

const handleKeyDown = (e) => {
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

  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}

const handlePaste = async (e) => {
  e.preventDefault()
  const text = (e.clipboardData || window.clipboardData).getData('text') || ''
  const digits = unformat(text)
  const input = e.target
  const caretDigitsBefore = countDigitsLeft(input.value, input.selectionStart)
  const nextRaw = format(normalize(unformat(display.value + digits)))
  applyAndEmit(nextRaw, caretDigitsBefore + digits.length)
}

const handleFocus = () => emit('focus')
const handleBlur = () => {
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
