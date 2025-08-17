<template>
  <div class="w-full relative" ref="selectWrapper">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>

    <div class="relative" @click="toggleDropdown">
      <div
        :class="[
          'w-full px-4 py-3.5 pr-12 text-sm bg-white border rounded-lg cursor-pointer transition-all duration-200 ease-in-out',
          isOpen ? 'border-gray-400' : 'border-gray-300 hover:border-gray-400',
          modelValue === '' ? 'text-gray-400' : 'text-gray-900 font-medium',
        ]"
      >
        {{ modelValue || placeholder }}
      </div>

      <div
        :class="[
          'absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ease-in-out text-gray-500',
          isOpen ? 'rotate-180' : '',
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto">
          <div
            v-for="(option, index) in options"
            :key="option"
            @click="selectOption(option)"
            :class="[
              'px-4 py-3 text-sm cursor-pointer transition-all duration-100',
              modelValue === option
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50',
              index !== options.length - 1 ? 'border-b border-gray-100' : '',
            ]"
          >
            <div class="flex items-center justify-between">
              <span>{{ option }}</span>
              <svg
                v-if="modelValue === option"
                class="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const selectWrapper = ref(null)
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option)
  isOpen.value = false
}

const closeDropdown = (event) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  options: Array,
})

const emit = defineEmits(['update:modelValue'])
</script>
