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
        :list="pendingList"
        @approve="handleApprove"
        @reject="handleReject"
      />
      <AdminListApproved v-else-if="currentAdminStatus === 'approved'" :list="approvedList" />
      <AdminListExpired
        v-else-if="currentAdminStatus === 'expired'"
        :list="expiredList"
        @delete="handleDelete"
      />
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
import { ref, computed } from 'vue'
import { usePropertyAdmin } from '@/stores/propertyadmin'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AdminList from '@/components/admin/AdminList.vue'
import AdminListApproved from '@/components/admin/AdminListApproved.vue'
import AdminListExpired from '@/components/admin/AdminListExpired.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

const propertyadmin = usePropertyAdmin()
propertyadmin.initializeMockData()

const pendingList = computed(() =>
  (propertyadmin.propertyList || []).filter((p) => p.status === '대기'),
)
const approvedList = computed(() =>
  (propertyadmin.propertyList || []).filter((p) => p.status === '승인됨'),
)
const expiredList = computed(() =>
  (propertyadmin.propertyList || []).filter((p) => p.status === '만료됨'),
)

// 탭 관련
const AdminTabs = [
  { label: '대기', value: 'pending' },
  { label: '승인 매물 조회', value: 'approved' },
  { label: '만료', value: 'expired' },
]
const currentAdminStatus = ref('pending')

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
    onSubmit: () => {
      const item = propertyadmin.propertyList.find((p) => p.id === id)
      if (item) item.status = '승인됨'
    },
  })
}

function handleReject(id) {
  showModal({
    message: '정말 거절하시겠습니까?',
    confirmText: '거절하기',
    onSubmit: () => {
      const item = propertyadmin.propertyList.find((p) => p.id === id)
      if (item) item.status = '거절됨'
    },
  })
}
</script>
