<template>
  <AdminLayout>
    <div class="funding-list-page">
      <div class="filter-tabs-container mb-2 shrink-0">
        <BaseTab :tabs="AdminTabs" v-model="currentAdminStatus" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto pb-24">
      <AdminList
        v-if="currentAdminStatus === 'pending'"
        :list="filteredList"
        @approve="handleApprove"
        @reject="handleReject"
      />
      <AdminListApproved v-else-if="currentAdminStatus === 'approved'" :list="filteredList" />
      <AdminListExpired v-else-if="currentAdminStatus === 'failed'" :list="filteredList" />
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
import { ref, computed, watch, onMounted } from 'vue'
import { usePropertyAdmin } from '@/stores/propertyadmin'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AdminList from '@/components/admin/AdminList.vue'
import AdminListApproved from '@/components/admin/AdminListApproved.vue'
import AdminListExpired from '@/components/admin/AdminListExpired.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

import { approveProperty, rejectProperty } from '@/api/admin'

const propertyadmin = usePropertyAdmin()

// 탭 관련
const AdminTabs = [
  { label: '대기', value: 'pending' },
  { label: '승인 매물 조회', value: 'approved' },
  { label: '만료', value: 'failed' },
]

const currentAdminStatus = ref('pending')

// 초기 로딩
onMounted(() => {
  propertyadmin.getPropertyList(currentAdminStatus.value)
})

// 탭 전환 시 API 호출
watch(currentAdminStatus, (val) => {
  propertyadmin.getPropertyList(val)
})

// 필터링된 리스트
const filteredList = computed(() => propertyadmin.propertyList || [])

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

function handleApprove(id) {
  showModal({
    message: '정말 승인하시겠습니까?',
    confirmText: '승인하기',
    onSubmit: async () => {
      await approveProperty(id)
      await propertyadmin.getPropertyList(currentAdminStatus.value)
    },
  })
}

function handleReject(id) {
  showModal({
    message: '정말 거절하시겠습니까?',
    confirmText: '거절하기',
    onSubmit: async () => {
      await rejectProperty(id)
      await propertyadmin.getPropertyList(currentAdminStatus.value)
    },
  })
}
</script>
