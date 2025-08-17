<template>
  <div class="w-full">
    <BaseTypography class="text-lg !font-bold mb-2">{{ title }}</BaseTypography>

    <div v-if="initialLoading" class="flex justify-center py-6">
      <LoadingSpinner />
    </div>

    <div v-else-if="items.length === 0" class="py-2">
      <slot name="empty">
        <BaseTypography class="text-sm !text-gray-500">등록된 매물이 없습니다.</BaseTypography>
      </slot>
    </div>

    <template v-else>
      <RouterLink
        v-for="item in items"
        :key="getItemId(item)"
        class="block py-1"
        :to="`${routePrefix}${getItemId(item)}`"
      >
        <div
          class="flex bg-white rounded-lg border px-3 py-2 items-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <img
            :src="item.thumbnail?.photoUrl || computedDefaultImg"
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
                />
              </div>
              <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                {{ item.achievementRate ?? 0 }}%
              </BaseTypography>
            </div>

            <BaseTypography class="text-xs !text-gray-500">
              남은 주(금액): {{ format(item.remainingShares ?? 0) }} /
              {{ formatPriceInEokwon(item.price) }}
            </BaseTypography>
          </div>
        </div>
      </RouterLink>

      <div :ref="setBottomRef" class="h-[1px] w-full opacity-0 pointer-events-none" />

      <div v-if="isLoading" class="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import LoadingSpinner from '@/components/common/Spinner/LoadingSpinner.vue'
import { format, formatPriceInEokwon } from '@/utils/format'
import { fetchUserPropertiesByStatus } from '@/api/property'
import useInfiniteList from '@/components/account/utils/useInfiniteList.js'

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true },
  pageSize: { type: Number, default: 5 },
  routePrefix: { type: String, default: '/admin/property-review/' },
  filterApprovedActive: { type: Boolean, default: false },
  defaultImg: { type: String, default: '' },
})

const emit = defineEmits(['init-done', 'data-change'])

const computedDefaultImg = computed(
  () => props.defaultImg || new URL('@/assets/images/sample-buliding.png', import.meta.url).href,
)

const getItemId = (item) =>
  item?.id ?? item?.propertyId ?? item?.fundingId ?? item?.funding?.id ?? item?.property?.id

const fetcher = async ({ page, pageSize }) => {
  const res = await fetchUserPropertiesByStatus({ status: props.status, page, size: pageSize })
  const raw = res ?? {}
  const content = Array.isArray(raw?.content) ? raw.content : []
  const filtered = props.filterApprovedActive
    ? content.filter((t) => t.status?.toUpperCase() === 'APPROVED' && (t.remainingShares ?? 0) > 0)
    : content
  return { ...raw, content: filtered }
}

const {
  items,
  isLoading,
  bottomRef,
  fetchNext,
  setupObserver,
  ensureObserve,
  kickstartIfVisible,
  length,
} = useInfiniteList({
  pageSize: props.pageSize,
  fetch: fetcher,
  map: (row) => row,
  rootMargin: '0px 0px 400px 0px',
})

const setBottomRef = (el) => (bottomRef.value = el)

const initialLoading = ref(true)
const loadError = ref(false)

onMounted(async () => {
  try {
    await fetchNext() // 1페이지 로딩
  } catch {
    loadError.value = true
  } finally {
    await nextTick()
    setupObserver()
    ensureObserve()

    kickstartIfVisible()

    setTimeout(() => {
      kickstartIfVisible()
    }, 300)

    initialLoading.value = false
    emit('init-done', { hasData: items.value.length > 0, error: loadError.value })
  }
})

watch(length, (n) => emit('data-change', n))
</script>

<style scoped></style>
