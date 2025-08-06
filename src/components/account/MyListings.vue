<template>
  <div class="py-3 min-h-[600px] flex flex-col items-center">
    <!-- ✅ 상단 중앙 고정된 매물 등록 버튼 -->
    <div class="mb-6">
      <BaseButton
        @click="goToPropertyRegisterPage"
        variant="secondary"
        class="px-6 py-3 rounded-lg bg-[#374152] hover:bg-[#1f2738]"
      >
        <div class="flex items-center">
          <BaseTypography color="white" size="sm" weight="medium">매물 등록하기</BaseTypography>
        </div>
      </BaseButton>
    </div>

    <!-- 💤 매물이 없을 때만 NoTradeItems 전체 너비 차지 -->
    <div v-if="isEmpty" class="w-full">
      <NoTradeItems />
    </div>

    <!-- ✅ 매물 목록이 있을 경우에만 렌더링 -->
    <div v-else class="w-full space-y-6">
      <div v-for="(group, index) in tradeGroups" :key="index">
        <BaseTypography class="text-lg !font-bold mb-2">
          {{ group.title }}
        </BaseTypography>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in group.items"
            :key="idx"
            class="flex bg-white rounded-lg border px-3 py-2 items-center"
          >
            <img
              :src="item.thumbnail?.photoUrl || defaultImg"
              alt="매물"
              class="w-16 h-16 object-cover rounded-md mr-3"
            />
            <div class="flex-1">
              <BaseTypography class="font-semibold text-sm !font-bold">
                {{ item.title }}
              </BaseTypography>
              <div class="flex items-center mt-1">
                <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-indigo-500 transition-all duration-300"
                    :style="{ width: (item.achievementRate || 0) + '%' }"
                  ></div>
                </div>
                <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                  {{ item.achievementRate ?? 0 }}%
                </BaseTypography>
              </div>
              <BaseTypography class="text-xs !text-gray-500">
                남은 주(금액): {{ format(item.remainingShares ?? 0) }} /
                {{ formatAmount(item.price) }}
              </BaseTypography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import NoTradeItems from './NoTradeItems.vue'
import { useRouter } from 'vue-router'
import BaseButton from '../common/Button/BaseButton.vue'
import { onMounted, computed } from 'vue'
import { usePropertyStore } from '@/stores/property'
import { format, formatAmount } from '@/utils/format'
// import { useAuthStore } from '@/stores/authStore' // 사용자 ID 가져오기 위해

const router = useRouter()
const propertyStore = usePropertyStore()
// const authStore = useAuthStore()
onMounted(async () => {
  // await propertyStore.loadUserProperties(authStore.user.id)
  await propertyStore.loadUserProperties(1)
  console.log('🐛 받은 매물:', propertyStore.userProperties)
  console.log('✅ VITE_API_URL:', import.meta.env.VITE_API_URL)
})

// 기본 이미지 경로 (썸네일 없을 때 사용)
const defaultImg = new URL('@/assets/images/sample-buliding.png', import.meta.url).href

// 매물 상태별로 그룹화
const tradeGroups = computed(() => [
  {
    title: '거래 진행중인 매물',
    items: propertyStore.userProperties.filter(
      (t) => t.status?.toUpperCase() === 'APPROVED' && (t.remainingShares ?? 0) > 0,
    ),
  },
  {
    title: '매각 완료된 매물',
    items: propertyStore.userProperties.filter(
      (t) =>
        t.status?.toUpperCase() === 'SOLD' ||
        (t.status?.toUpperCase() === 'APPROVED' && (t.remainingShares ?? 0) === 0),
    ),
  },
  {
    title: '승인 대기 중인 매물',
    items: propertyStore.userProperties.filter((t) => t.status?.toUpperCase() === 'PENDING'),
  },
  {
    title: '거절된 매물',
    items: propertyStore.userProperties.filter((t) => t.status?.toUpperCase() === 'REJECTED'),
  },
])
const isEmpty = computed(() => tradeGroups.value.every((group) => group.items.length === 0))

const goToPropertyRegisterPage = () => {
  router.push('/property/register')
}
</script>
