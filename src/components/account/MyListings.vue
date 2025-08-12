<!-- MyListings.vue -->
<template>
  <div class="py-2"></div>
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

    <!-- ⏳ 0단계: 첫 진입 시 전역 스피너만 표시 (리스트/그룹 타이틀 전부 숨김) -->
    <div v-if="globalInitialLoading" class="w-full flex justify-center py-12">
      <img
        src="@/assets/images/character/loading.png"
        alt="로딩 캐릭터"
        class="w-12 h-12 animate-spin opacity-70"
      />
    </div>

    <!-- 💤 모든 그룹이 비어있을 때 -->
    <div v-else-if="isEmpty" class="w-full">
      <NoTradeItems />
    </div>

    <!-- ✅ 그룹별 매물 목록 + 무한스크롤 (전역 스피너 종료 후 노출) -->
    <div v-else class="w-full space-y-6">
      <div v-for="group in groupConfig" :key="group.key">
        <BaseTypography class="text-lg !font-bold mb-2">
          {{ group.title }}
        </BaseTypography>

        <!-- ⏳ 1단계: 그룹별 첫 페이지 로딩 -->
        <div v-if="pageInfo[group.key].initialLoading" class="flex justify-center py-6">
          <img
            src="@/assets/images/character/loading.png"
            alt="로딩 캐릭터"
            class="w-12 h-12 animate-spin opacity-70"
          />
        </div>

        <!-- ✅ 2단계: 첫 페이지 이후 리스트 표시 -->
        <template v-else>
          <!-- ✅ 카드 전체를 RouterLink로 변경 -->
          <RouterLink
            v-for="item in listings[group.key]"
            :key="getItemId(item)"
            class="block py-1"
            :to="`/admin/property-review/${getItemId(item)}`"
          >
            <div
              class="flex bg-white rounded-lg border px-3 py-2 items-center cursor-pointer hover:bg-gray-50 transition-colors"
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
          </RouterLink>

          <!-- 📌 무한스크롤 트리거 -->
          <div :ref="(el) => (bottomRefs[group.key] = el)" class="h-2"></div>

          <!-- 🔄 추가 페이지 로딩 스피너 -->
          <div v-if="pageInfo[group.key].isLoading" class="flex justify-center py-4">
            <img
              src="@/assets/images/character/loading.png"
              alt="로딩 캐릭터"
              class="w-12 h-12 animate-spin opacity-70"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '../common/Button/BaseButton.vue'
import NoTradeItems from './NoTradeItems.vue'
import { format, formatAmount } from '@/utils/format'
import api from '@/libs/axios'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

// ✅ 그룹 설정
const groupConfig = [
  { key: 'APPROVED_ACTIVE', title: '거래 진행중인 매물', status: 'approved' },
  { key: 'SOLD', title: '매각 완료된 매물', status: 'sold' },
  { key: 'PENDING', title: '승인 대기 중인 매물', status: 'pending' },
  { key: 'REJECTED', title: '거절된 매물', status: 'rejected' },
]

// ✅ 상태 관리
const listings = reactive({
  APPROVED_ACTIVE: [],
  SOLD: [],
  PENDING: [],
  REJECTED: [],
})

const pageInfo = reactive({
  APPROVED_ACTIVE: {
    page: 0,
    hasNextPage: true,
    isLoading: false,
    initialLoading: true,
    fetchedOnce: false,
  },
  SOLD: { page: 0, hasNextPage: true, isLoading: false, initialLoading: true, fetchedOnce: false },
  PENDING: {
    page: 0,
    hasNextPage: true,
    isLoading: false,
    initialLoading: true,
    fetchedOnce: false,
  },
  REJECTED: {
    page: 0,
    hasNextPage: true,
    isLoading: false,
    initialLoading: true,
    fetchedOnce: false,
  },
})

// ✅ IntersectionObserver 보관
const observerMap = {}
const bottomRefs = reactive({})

// 기본 이미지
const defaultImg = new URL('@/assets/images/sample-buliding.png', import.meta.url).href

// ✅ 페이지 크기
const PAGE_SIZE = 5

// ✅ 딜레이(요청 후 2초)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ✅ 스토어 userId | 없으면 3
const auth = useAuthStore()
const { userId } = storeToRefs(auth)
const effectiveUserId = computed(() => userId.value ?? 3)

// ✅ 라우터
const router = useRouter()

// ✅ id 안전 추출 헬퍼
const getItemId = (item) =>
  item?.id ?? item?.propertyId ?? item?.fundingId ?? item?.funding?.id ?? item?.property?.id

const goToPropertyRegisterPage = () => {
  router.push('/property/register')
}

// ✅ 전역 초기 로딩: 모든 그룹이 아직 첫 로딩 중일 때만 true
const globalInitialLoading = computed(() =>
  Object.values(pageInfo).every((info) => info.initialLoading),
)

// ✅ 어떤 그룹이라도 초기 로딩 중이면 NoTradeItems 숨김
const anyInitialLoading = computed(() =>
  Object.values(pageInfo).some((info) => info.initialLoading),
)

// ✅ 모든 그룹 비어있는지 체크 (초기 로딩 중엔 false)
const isEmpty = computed(() => {
  if (anyInitialLoading.value) return false
  return Object.values(listings).every((list) => list.length === 0)
})

// ✅ API 호출
const fetchProperties = async (groupKey, statusParam) => {
  const info = pageInfo[groupKey]
  if (info.isLoading || !info.hasNextPage || !effectiveUserId.value) return

  const isFirstPage = info.page === 0 && !info.fetchedOnce
  if (isFirstPage) info.initialLoading = true

  info.isLoading = true
  try {
    const res = await api.get(`/api/auth/property/user`, {
      params: { page: info.page, size: PAGE_SIZE, status: statusParam },
    })

    await delay(2000) // 요청 후 2초 대기
    const content = res.data?.data?.content || []

    if (groupKey === 'APPROVED_ACTIVE') {
      listings[groupKey].push(
        ...content.filter(
          (t) => t.status?.toUpperCase() === 'APPROVED' && (t.remainingShares ?? 0) > 0,
        ),
      )
    } else {
      listings[groupKey].push(...content)
    }

    info.hasNextPage = !res.data?.data?.last
    info.page++
    info.fetchedOnce = true
  } catch (e) {
    console.error(`❌ ${groupKey} 로드 실패:`, e)
  } finally {
    info.isLoading = false
    if (info.fetchedOnce) info.initialLoading = false
  }
}

// ✅ 옵저버 연결
const setupObserverForGroup = (groupKey, statusParam) => {
  observerMap[groupKey] = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fetchProperties(groupKey, statusParam)
      }
    },
    { threshold: 1 },
  )

  if (bottomRefs[groupKey]) {
    observerMap[groupKey].observe(bottomRefs[groupKey])
  }
}

// ✅ onMounted에서 초기 로딩 + 옵저버 등록
onMounted(async () => {
  if (!effectiveUserId.value) return
  // 순차로 요청하여 "전역 스피너만" 상태가 초반에 한 번 보였다가,
  // 첫 완료 시점부터 그룹 섹션이 나타나게 됨.
  for (const group of groupConfig) {
    await fetchProperties(group.key, group.status)
    nextTick(() => setupObserverForGroup(group.key, group.status))
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 0.4s linear infinite;
}
</style>
