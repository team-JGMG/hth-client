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

    <BaseModal
      :isOpen="modal.open"
      @close="modal.open = false"
      @submit="modal.onSubmit"
      :submitButtonClass="modal.buttonClass"
      :confirmText="modal.confirmText"
    >
      <p class="text-sm font-medium text-center">{{ modal.message }}</p>
    </BaseModal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AdminList from '@/components/admin/AdminList.vue'
import AdminListApproved from '@/components/admin/AdminListApproved.vue'
import AdminListExpired from '@/components/admin/AdminListExpired.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import { usePropertyAdmin } from '@/stores/propertyadmin'

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

// 모달 관련
const modal = ref({
  open: false,
  message: '',
  confirmText: '',
  buttonClass: '',
  onSubmit: () => {},
})

function showModal(message, confirmText, buttonClass, onSubmit) {
  modal.value = {
    open: true,
    message,
    confirmText,
    buttonClass,
    onSubmit: () => {
      onSubmit()
      modal.value.open = false
    },
  }
}

// 승인 처리
function handleApprove(id) {
  const item = propertyadmin.propertyList.find((p) => p.id === id)
  if (item) item.status = '승인됨'
}

// 거절 처리
function handleReject(id) {
  showModal('정말 거절하시겠습니까?', '거절하기', () => {
    const idx = propertyadmin.propertyList.findIndex((p) => p.id === id)
    if (idx !== -1) propertyadmin.propertyList.splice(idx, 1)
  })
}

// 삭제 처리
function handleDelete(id) {
  showModal('정말 삭제하시겠습니까?', '삭제하기', () => {
    const idx = propertyadmin.propertyList.findIndex((p) => p.id === id)
    if (idx !== -1) propertyadmin.propertyList.splice(idx, 1)
  })
}
</script>
