<!-- MyListings.vue -->
<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '../common/Button/BaseButton.vue'
import LoadingSpinner from '../common/Spinner/LoadingSpinner.vue'
import NoTradeItems from './NoTradeItems.vue'
import ListingGroup from './ListingsTab/ListingGroup.vue'

const router = useRouter()
const goToPropertyRegisterPage = () => router.push('/property/register')

const groups = [
  {
    key: 'APPROVED_ACTIVE',
    title: '거래 진행중인 매물',
    status: 'approved',
    filterApprovedActive: true,
  },
  { key: 'SOLD', title: '매각 완료된 매물', status: 'sold' },
  { key: 'PENDING', title: '승인 대기 중인 매물', status: 'pending' },
  { key: 'REJECTED', title: '거절된 매물', status: 'rejected' },
]

const progress = reactive(
  Object.fromEntries(groups.map((g) => [g.key, { initDone: false, hasData: false }])),
)

const onInitDone = (key, { hasData }) => {
  progress[key].initDone = true
  progress[key].hasData = hasData
}
const onDataChange = (key, n) => {
  progress[key].hasData = n > 0
}

const allInitDone = computed(() => Object.values(progress).every((p) => p.initDone))
const anyHasData = computed(() => Object.values(progress).some((p) => p.hasData))
</script>

<template>
  <div class="py-2"></div>

  <div class="relative py-3 min-h-[600px] flex flex-col items-center">
    <!-- 상단 버튼 -->
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

    <!-- 그룹 섹션들: 항상 마운트 (각 그룹 내부에서 무한스크롤 진행) -->
    <div
      class="w-full space-y-6"
      :class="{
        'opacity-0 pointer-events-none': !allInitDone, // 초기 로딩 동안만 보이지 않게
        hidden: allInitDone && !anyHasData, // ✅ 전부 비었으면 완전히 숨김
      }"
    >
      <ListingGroup
        v-for="g in groups"
        :key="g.key"
        :title="g.title"
        :status="g.status"
        :filter-approved-active="g.filterApprovedActive"
        :page-size="5"
        :route-prefix="'/admin/property-review/'"
        @init-done="onInitDone(g.key, $event)"
        @data-change="onDataChange(g.key, $event)"
      />
    </div>

    <!-- 전부 비었을 때: 안내만 노출 -->
    <div v-if="allInitDone && !anyHasData" class="w-full">
      <NoTradeItems />
    </div>

    <!-- 전역 초기 로딩 오버레이 -->
    <div v-if="!allInitDone" class="absolute inset-0 flex justify-center items-start pt-20">
      <LoadingSpinner />
    </div>
  </div>
</template>
