<template>
  <div
    class="flex flex-col p-4 border rounded-xl shadow-sm bg-white w-full transition relative gap-2"
    :class="{
      'border-blue-300': status === '승인됨',
      'border-red-300': status === '거절됨',
      'border-gray-300': status === '만료됨',
    }"
    @click="goToDetail"
  >
    <div class="flex justify-between items-center">
      <!-- 제목 -->
      <BaseTypography size="xl" weight="semibold" color="black">
        {{ title }}
      </BaseTypography>

      <!-- 상세페이지 이동 버튼 -->
      <div>
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </div>
    </div>

    <div class="flex justify-between gap-1 items-center">
      <!-- 왼쪽 텍스트 -->
      <div class="flex flex-col justify-between flex-1 mr-4">
        <div>
          <!-- 주소 -->
          <BaseTypography size="xs" weight="regular" color="gray-2" class="mt-0.5">
            {{ address }}
          </BaseTypography>

          <!-- 희망 매각가 -->
          <div class="flex items-center gap-2 mt-2">
            <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
              희망 매각가
            </BaseTypography>
            <BaseTypography weight="bold" color="black">
              {{ formattedPrice }}
            </BaseTypography>
          </div>

          <!-- 희망 공모 기간 -->
          <div class="flex items-center gap-2 mt-1">
            <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
              희망 공모 기간
            </BaseTypography>
            <BaseTypography weight="bold" color="black"> {{ postingPeriod }}개월 </BaseTypography>
          </div>
        </div>
      </div>

      <!-- 오른쪽 이미지 -->
      <img
        :src="image || fallbackImage"
        alt="매물 이미지"
        class="w-40 h-20 object-cover rounded-md self-end mr-2"
      />
    </div>

    <!-- 버튼 -->
    <div class="flex w-full gap-2 mt-2">
      <template v-if="status === '대기'">
        <BaseButton
          variant="outline"
          class="w-1/2"
          color="blue"
          @click="$emit('approve')"
          @click.stop="$emit('approve')"
        >
          <BaseTypography size="xs" weight="semibold" color="blue"> 매물 승인 </BaseTypography>
        </BaseButton>
        <BaseButton
          variant="outline"
          color="red"
          class="w-1/2 border-red-500 hover:bg-red-50"
          @click="$emit('reject')"
          @click.stop="$emit('reject')"
        >
          <BaseTypography size="xs" weight="semibold" color="red"> 매물 거절 </BaseTypography>
        </BaseButton>
      </template>

      <template v-else-if="status === '승인됨'">
        <BaseButton variant="primary" class="w-full bg-blue-500 hover:bg-blue-500" disabled>
          <BaseTypography size="xs" weight="semibold" color="white"> 매물 승인됨 </BaseTypography>
        </BaseButton>
      </template>

      <template v-else-if="status === '거절됨'">
        <BaseButton variant="primary" class="w-full bg-red-400 hover:bg-red-400" disabled>
          <BaseTypography size="xs" weight="semibold" color="white"> 매물 거절됨 </BaseTypography>
        </BaseButton>
      </template>

      <template v-else-if="status === '만료됨'">
        <BaseButton variant="primary" class="w-full bg-gray-400 hover:bg-gray-400" disabled>
          <BaseTypography size="xs" weight="semibold" color="white"> 매물 만료됨 </BaseTypography>
        </BaseButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { formatPriceInEokwon } from '@/utils/format'
SSimport { useRouter } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import fallbackImage from '@/assets/images/cardtestimage.png'

const props = defineProps({
  id: Number,
  title: String,
  address: String,
  price: Number,
  period: String,
  postingPeriod: Number,
  image: String,
  status: String,
})

const formattedPrice = formatPriceInEokwon(props.price)

const router = useRouter()

const goToDetail = () => {
  router.push(`/admin/property-review/${props.id}`)
}
</script>
