<template>
  <AdminLayout>
    <div class="flex flex-col h-[calc(100vh-8rem)]">
      <div class="funding-list-page shrink-0">
        <div class="filter-tabs-container mb-2">
          <BaseTab :tabs="AdminTabs" v-model="currentAdminStatus" />
        </div>
      </div>

      <!-- 탭 내용 부분 -->
      <div ref="scrollContainerRef" class="flex-1 overflow-y-auto pb-24 scrollbar-none">
        <AdminList
          :list="filteredList"
          :category="currentAdminStatus"
          @approve="handleApprove"
          @reject="handleReject"
        />

        <div ref="bottomRef" class="h-2" />
        <div v-if="isLoading" class="flex justify-center py-4">
          <img
            src="@/assets/images/character/loading.png"
            alt="로딩 캐릭터"
            class="w-12 h-12 animate-spin opacity-70"
          />
        </div>
      </div>
    </div>

    <BaseModal :isOpen="modal.open" @close="modal.open = false">
      <!-- 본문 메시지 -->
      <template #default>
        <div class="p-4 pb-0">
          <BaseTypography class="text-center" size="xl" weight="bold">
            {{ modal.message }}
          </BaseTypography>
        </div>
      </template>

      <!-- 버튼 영역 -->
      <template #submit>
        <CompletedButton
          color="black"
          text-color="white"
          active-color="gray-700"
          class="w-full font-semibold py-3"
          @click="modal.onSubmit"
        >
          {{ modal.confirmText }}
        </CompletedButton>
      </template>
    </BaseModal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { usePropertyAdmin } from '@/stores/propertyadmin'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AdminList from '@/components/admin/AdminList.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

import { approveProperty, rejectProperty } from '@/api/admin'

const propertyadmin = usePropertyAdmin()
const { resetList } = propertyadmin

// 탭 관련
const AdminTabs = [
  { label: '대기', value: 'pending' },
  { label: '승인 매물 조회', value: 'approved' },
  { label: '만료', value: 'failed' },
]

const currentAdminStatus = ref('pending')

// 필터링된 리스트
const filteredList = computed(() => propertyadmin.propertyList || [])

// 무한 스크롤 관련
const scrollContainerRef = ref(null)
const bottomRef = ref(null)
const isLoading = ref(false)
let observer = null

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchNextPage = async () => {
  if (isLoading.value || !propertyadmin.hasNext) return
  isLoading.value = true
  try {
    await delay(300)
    await propertyadmin.getPropertyList(currentAdminStatus.value)
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  } finally {
    isLoading.value = false
  }
}

const setupObserver = async () => {
  await nextTick()
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && propertyadmin.hasNext && !isLoading.value) {
        fetchNextPage()
      }
    },
    {
      threshold: 1.0,
      root: scrollContainerRef.value,
    },
  )

  if (bottomRef.value) observer.observe(bottomRef.value)
}

// 초기 로딩 및 탭 전환
onMounted(async () => {
  resetList()
  await fetchNextPage()
  setupObserver()
})

watch(currentAdminStatus, async () => {
  resetList()
  if (scrollContainerRef.value) scrollContainerRef.value.scrollTop = 0
  await fetchNextPage()
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

// 모달 상태
const modal = ref({
  open: false,
  message: '',
  confirmText: '',
  onSubmit: () => {},
})

function showModal({ message, confirmText, onSubmit }) {
  modal.value = {
    open: true,
    message,
    confirmText,
    onSubmit: () => {
      onSubmit()
      modal.value.open = false
    },
  }
}

async function handleApprovalAction(action, id) {
  await action(id)
  resetList()
  await fetchNextPage()
  setupObserver()
}

function handleApprove(id) {
  showModal({
    message: '정말 승인하시겠습니까?',
    confirmText: '승인하기',
    onSubmit: () => handleApprovalAction(approveProperty, id),
  })
}

function handleReject(id) {
  showModal({
    message: '정말 거절하시겠습니까?',
    confirmText: '거절하기',
    onSubmit: () => handleApprovalAction(rejectProperty, id),
  })
}
</script>
