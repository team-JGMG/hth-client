<template>
  <div class="mb-12 relative">
    <BaseTypography class="mb-2" weight="semibold">{{ title }}</BaseTypography>

    <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
      <span
        class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
        :class="allChecked ? 'bg-black text-white' : 'bg-gray-300 text-white'"
      >
        check
      </span>
      <span class="ml-2 text-sm">전체 동의합니다.</span>
    </div>

    <hr class="mb-3" />

    <ul class="space-y-2 text-sm text-gray-800">
      <li v-for="item in items" :key="item.key" class="flex items-center justify-between">
        <div class="flex items-center cursor-pointer" @click="toggle(item.key)">
          <span
            class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
            :class="agreementsLocal[item.key] ? 'bg-black text-white' : 'bg-gray-300 text-white'"
          >
            check
          </span>
          <span class="ml-2">{{ item.label }}</span>
        </div>

        <span
          v-if="showModal && item.modalKey"
          class="material-symbols-outlined text-xs cursor-pointer"
          @click.stop="open(item.modalKey)"
          style="font-size: 14px"
        >
          arrow_forward_ios
        </span>
      </li>
    </ul>

    <BaseTypography
      v-if="errorOnPartial && isPartiallyChecked"
      color="red-1"
      size="xs"
      class="absolute mt-2 left-0 top-full"
    >
      {{ errorText }}
    </BaseTypography>

    <BaseModal v-if="showModal" :isOpen="modalVisible" @close="closeModal" @submit="agreeAndClose">
      <template #default>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">{{ modalTitle }}</h3>
        </div>
        <BaseTypography size="sm" color="gray-1" class="whitespace-pre-wrap">
          {{ activeModalText }}
        </BaseTypography>
        <div class="py-3"></div>
      </template>

      <template #submit>
        <BaseTypography class="!text-white font-medium text-base">동의하기</BaseTypography>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'

const props = defineProps({
  agreements: { type: Object, required: true },

  items: {
    type: Array,
    default: () => [
      {
        key: 'terms',
        label: '이용약관에 동의합니다. (필수)',
        modalKey: 'terms',
        title: '이용약관',
      },
      {
        key: 'privacy',
        label: '개인정보 수집 및 이용에 동의합니다. (필수)',
        modalKey: 'privacy',
        title: '개인정보 처리방침',
      },
      { key: 'age', label: '만 14세 이상입니다. (필수)' },
    ],
  },

  showModal: { type: Boolean, default: true },
  modalText: {
    type: Object,
    default: () => ({ terms: '', privacy: '' }),
  },

  title: { type: String, default: '약관 동의' },
  errorOnPartial: { type: Boolean, default: false },
  errorText: { type: String, default: '* 모든 약관에 동의해주세요.' },
})

const emit = defineEmits(['update:agreements', 'change', 'valid-change'])

const agreementsLocal = computed({
  get: () => props.agreements,
  set: (next) => emit('update:agreements', next),
})

function setKey(key, value) {
  emit('update:agreements', { ...agreementsLocal.value, [key]: value })
}

const allChecked = computed(() => Object.values(agreementsLocal.value).every(Boolean))

const isPartiallyChecked = computed(() => {
  const vals = Object.values(agreementsLocal.value)
  const count = vals.filter(Boolean).length
  return count > 0 && count < vals.length
})

const modalVisible = ref(false)
const activeModal = ref('')

const modalTitle = computed(() => {
  const found = props.items.find((i) => i.modalKey === activeModal.value)
  return found?.title || ''
})
const activeModalText = computed(() => props.modalText?.[activeModal.value] || '')

function toggle(key) {
  setKey(key, !agreementsLocal.value[key])
}

function toggleAll() {
  const next = !allChecked.value
  const updated = {}
  for (const item of props.items) updated[item.key] = next
  emit('update:agreements', updated)
}

function open(key) {
  if (!props.showModal) return
  activeModal.value = key
  modalVisible.value = true
}
function closeModal() {
  modalVisible.value = false
}
function agreeAndClose() {
  if (activeModal.value) setKey(activeModal.value, true)
  closeModal()
}

watch([allChecked, isPartiallyChecked], () => {
  emit('change', { allChecked: allChecked.value, isPartiallyChecked: isPartiallyChecked.value })
  emit('valid-change', allChecked.value)
})
</script>
