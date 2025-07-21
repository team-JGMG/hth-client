<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  all: Boolean,
  agreements: Object,
})

const emit = defineEmits(['update:all', 'update:agreements'])

const toggleAll = (e) => {
  const checked = e.target.checked
  emit('update:agreements', {
    terms: checked,
    privacy: checked,
    age: checked,
  })
  emit('update:all', checked)
}

const updateSingle = (key, val) => {
  const updated = { ...props.agreements, [key]: val }
  emit('update:agreements', updated)
  const allChecked = updated.terms && updated.privacy && updated.age
  emit('update:all', allChecked)
}
</script>

<template>
  <div class="mb-6">
    <!-- 제목 -->
    <BaseTypography class="block font-semibold text-base mb-3">약관 동의</BaseTypography>

    <!-- 전체 동의 -->
    <label class="flex items-center mb-4 cursor-pointer">
      <input type="checkbox" :checked="all" @change="toggleAll" class="w-4 h-4 mr-2 accent-black" />
      <BaseTypography class="text-sm font-medium">전체 동의합니다.</BaseTypography>
    </label>

    <!-- 개별 항목 -->
    <ul class="space-y-3 pl-1 text-gray-700">
      <li class="flex items-center">
        <input
          type="checkbox"
          :checked="agreements.terms"
          @change="(e) => updateSingle('terms', e.target.checked)"
          class="w-4 h-4 mr-2 accent-black"
        />
        <BaseTypography class="text-sm">이용약관에 동의합니다. (필수)</BaseTypography>
      </li>

      <li class="flex items-center">
        <input
          type="checkbox"
          :checked="agreements.privacy"
          @change="(e) => updateSingle('privacy', e.target.checked)"
          class="w-4 h-4 mr-2 accent-black"
        />
        <BaseTypography class="text-sm">개인정보 수집 및 이용에 동의합니다. (필수)</BaseTypography>
      </li>

      <li class="flex items-center">
        <input
          type="checkbox"
          :checked="agreements.age"
          @change="(e) => updateSingle('age', e.target.checked)"
          class="w-4 h-4 mr-2 accent-black"
        />
        <BaseTypography class="text-sm">만 14세 이상입니다. (필수)</BaseTypography>
      </li>
    </ul>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  appearance: none;
  border: 1.5px solid #999;
  border-radius: 4px;
  width: 16px;
  height: 16px;
  position: relative;
}
input[type='checkbox']:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 0px;
  width: 4px;
  height: 8px;
  border: solid black;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
