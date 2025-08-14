<!--DividendModal.vue -->
<script setup>
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  isOpen: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  buildingName: { type: String, default: '' },
  groups: { type: Array, default: () => [] }, // [{year, items:[{dateMd, amount}]}]
})
const emit = defineEmits(['close'])
</script>

<template>
  <BaseModal :isOpen="isOpen" @close="emit('close')" @submit="emit('close')">
    <div>
      <BaseTypography size="xl" weight="bold" class="mb-6">{{ buildingName }}</BaseTypography>

      <div v-if="loading" class="py-12 text-center">
        <BaseTypography class="text-sm !text-gray-500">불러오는 중...</BaseTypography>
      </div>

      <div v-else-if="groups.length" class="space-y-6 max-h-[400px] overflow-y-auto pr-1">
        <div v-for="(group, gIdx) in groups" :key="gIdx">
          <BaseTypography size="sm" class="mb-2">{{ group.year }}년</BaseTypography>

          <div
            v-for="(row, idx) in group.items"
            :key="idx"
            class="flex items-center justify-between p-4 rounded-md"
            :class="idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
          >
            <BaseTypography size="sm">{{ row.dateMd }}</BaseTypography>
            <BaseTypography size="sm" weight="bold" class="!text-blue-600">
              {{ row.amount }}
            </BaseTypography>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center">
        <BaseTypography class="text-sm !text-gray-500">배당받은 내역이 없습니다.</BaseTypography>
      </div>
    </div>

    <template #submit>
      <BaseTypography class="!text-white font-medium text-base">확인</BaseTypography>
    </template>
  </BaseModal>
</template>
