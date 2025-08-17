<template>
  <div
    class="flex flex-col p-4 border rounded-xl shadow-sm bg-white w-full transition relative gap-2"
    @click="goToDetail"
  >
    <div class="flex justify-between items-center">
      <BaseTypography size="xl" weight="semibold" color="black">
        {{ title }}
      </BaseTypography>

      <div>
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </div>
    </div>

    <div class="flex justify-between gap-2 items-start md:items-center">
      <div class="flex flex-col justify-between flex-1 w-0 mr-2">
        <BaseTypography
          size="xs"
          weight="regular"
          color="gray-2"
          class="truncate whitespace-nowrap overflow-hidden w-full"
        >
          {{ address }}
        </BaseTypography>

        <div class="flex items-center mt-2">
          <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
            희망 매각가
          </BaseTypography>
          <BaseTypography weight="bold" color="black" class="whitespace-nowrap">
            {{ formattedPrice }}
          </BaseTypography>
        </div>

        <div class="flex items-center mt-1">
          <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
            희망 공모 기간
          </BaseTypography>
          <BaseTypography weight="bold" color="black" class="whitespace-nowrap">
            {{ postingPeriod }}개월
          </BaseTypography>
        </div>
      </div>

      <img
        :src="image || fallbackImage"
        alt="매물 이미지"
        class="max-w-[160px] h-20 object-cover rounded-md md:self-end"
      />
    </div>

    <div class="flex w-full gap-2 mt-2">
      <template v-if="category === 'pending'">
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

      <template v-else-if="category === 'approved'">
        <BaseButton variant="primary" class="w-full bg-blue-500 hover:bg-blue-500" disabled>
          <BaseTypography size="xs" weight="semibold" color="white"> 매물 승인됨 </BaseTypography>
        </BaseButton>
      </template>

      <template v-else-if="category === 'failed'">
        <BaseButton variant="primary" class="w-full bg-gray-400 hover:bg-gray-400" disabled>
          <BaseTypography size="xs" weight="semibold" color="white"> 매물 만료됨 </BaseTypography>
        </BaseButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { formatPriceInEokwon } from '@/utils/format'
import { useRouter } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import fallbackImage from '@/assets/images/cardtestimage.png'

const props = defineProps({
  propertyId: Number,
  address: String,
  postingPeriod: Number,
  price: Number,
  status: String,
  image: String,
  title: String,
  category: String,
})

const formattedPrice = formatPriceInEokwon(props.price)

const router = useRouter()

const goToDetail = () => {
  router.push(`/admin/property-review/${props.propertyId}`)
}
</script>
