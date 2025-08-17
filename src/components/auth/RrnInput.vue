<script setup>
import { ref, computed, watch } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  rrnFront: String,
  rrnBack: String,
  error: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:rrnFront', 'update:rrnBack'])

const rrnBackRaw = ref(props.rrnBack || '')

watch(
  () => props.rrnBack,
  (val) => {
    if (val !== rrnBackRaw.value) {
      rrnBackRaw.value = val
    }
  },
)

const displayValue = computed(() => {
  if (!rrnBackRaw.value) return ''
  return rrnBackRaw.value
    .split('')
    .map((char, idx) => (idx === 0 ? char : '•'))
    .join('')
})

const handleMaskedInput = (e) => {
  const rawInput = e.target.value.replace(/\D/g, '').slice(0, 7)
  rrnBackRaw.value = rawInput
  emit('update:rrnBack', rrnBackRaw.value)
}

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
      <div class="flex-1">
        <input
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="앞 6자리"
          class="w-full border-b border-gray-300 focus:outline-none focus:border-black p-2 text-base"
          :value="props.rrnFront"
          :class="[
            'w-full border-b p-2 text-base focus:outline-none focus:border-red-500',
            props.error ? 'border-red-500' : 'border-gray-300',
          ]"
          @input="(e) => emit('update:rrnFront', e.target.value.replace(/\D/g, '').slice(0, 6))"
        />
      </div>

      <p class="text-base">-</p>

      <div class="flex-1 relative">
        <div
          class="absolute w-full inset-0 px-1 py-2 text-base tracking-widest pointer-events-none text-black"
        >
          {{ displayValue }}
        </div>

        <input
          type="text"
          inputmode="numeric"
          maxlength="7"
          placeholder="뒤 7자리"
          class="w-full border-b border-gray-300 focus:outline-none focus:border-black p-2 tracking-widest text-transparent caret-black bg-transparent text-base"
          :value="rrnBackRaw"
          @input="handleMaskedInput"
          :class="[
            'w-full border-b p-2 text-base text-transparent caret-black bg-transparent tracking-widest focus:outline-none focus:border-red-500',
            props.error ? 'border-red-500' : 'border-gray-300',
          ]"
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
