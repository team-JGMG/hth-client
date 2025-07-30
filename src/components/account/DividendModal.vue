<!-- dividendModal.vue -->
<template>
  <Teleport to="#modal">
    <div
      v-if="isOpen"
      @click="onBackdropClick"
      class="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div @click.stop class="w-[370px] bg-white rounded-lg p-4 relative box-border">
        <!-- 닫기 버튼 -->
        <button
          type="button"
          aria-label="닫기"
          @click="emit('close')"
          class="absolute top-4 right-4"
        >
          <span
            class="material-symbols-outlined"
            style="
              font-size: 1rem;
              color: #838a9a;
              width: 1rem;
              height: 1rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
          >
            close
          </span>
        </button>

        <!-- 제목 -->
        <BaseTypography class="text-base !font-bold mb-2">
          {{ buildingName }}
        </BaseTypography>

        <!-- 내용 -->
        <div v-if="dividends.length" class="space-y-0">
          <BaseTypography class="text-sm text-gray-500 mb-2">{{ year }}년</BaseTypography>
          <div
            v-for="(item, index) in dividends"
            :key="index"
            class="flex items-center justify-between p-4 rounded-md"
            :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
          >
            <BaseTypography class="text-sm">{{ item.date }}</BaseTypography>
            <BaseTypography class="text-sm !font-semibold !text-blue-600">
              +{{ item.amount }}
            </BaseTypography>
          </div>
          <div class="py-12"></div>
        </div>

        <div v-else class="py-12 text-center">
          <BaseTypography class="text-sm !text-gray-500">
            배당받은 내역이 없습니다.
          </BaseTypography>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  isOpen: Boolean,
  buildingName: {
    type: String,
    required: true,
  },
  dividends: {
    type: Array,
    default: () => [],
  },
  year: {
    type: [String, Number],
    default: new Date().getFullYear(),
  },
})

const emit = defineEmits(['close'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<style scoped></style>
