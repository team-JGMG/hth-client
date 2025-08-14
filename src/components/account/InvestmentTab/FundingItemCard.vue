<script setup>
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

defineProps({
  item: { type: Object, required: true },
  isCancelLoading: { type: Boolean, default: false },
})
const emit = defineEmits(['click', 'cancel'])

function onCardClick() {
  console.log('[FundingItemCard] card clicked')
  emit('click')
}

function onCancelClick(e) {
  e.stopPropagation()
  console.log('[FundingItemCard] cancel clicked')
  emit('cancel')
}
</script>

<template>
  <div
    class="flex justify-between bg-white rounded-lg border px-3 py-2 cursor-pointer hover:bg-gray-50"
    @click="onCardClick"
  >
    <div class="flex items-center">
      <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
      <div>
        <BaseTypography class="font-semibold text-sm !font-bold">{{ item.name }}</BaseTypography>

        <BaseTypography v-if="item.shareCount" class="text-xs !text-gray-500 mt-1">
          보유 수량: {{ item.shareCount }}주
        </BaseTypography>

        <div class="flex items-center mt-1">
          <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-indigo-500 transition-all duration-300"
              :style="{ width: item.percent + '%' }"
            />
          </div>
          <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
            {{ item.percent }}%
          </BaseTypography>
        </div>

        <BaseTypography class="text-xs !text-gray-500 mt-1">
          남은 주(금액): {{ Number(item.left).toLocaleString() }}
          /
          {{
            item.total && new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(item.total)
          }}
        </BaseTypography>
      </div>
    </div>

    <div class="flex flex-col justify-between items-end ml-2 h-full" @click.stop>
      <div class="h-14" />
      <BaseButton
        v-if="item.status === 'pending'"
        :disabled="isCancelLoading"
        @click="onCancelClick"
        variant="danger"
        class="text-xs text-white rounded-md px-3 py-2 hover:bg-[#e63232] transition-colors duration-150 whitespace-nowrap"
      >
        <span class="text-xs font-medium">{{ isCancelLoading ? '취소 중...' : '취소하기' }}</span>
      </BaseButton>

      <BaseButton
        v-else-if="item.status === 'refunded'"
        disabled
        class="text-xs bg-gray-300 text-white rounded-md px-3 py-2 cursor-not-allowed whitespace-nowrap"
      >
        <span class="text-xs font-medium">거래만료</span>
      </BaseButton>
    </div>
  </div>
</template>
