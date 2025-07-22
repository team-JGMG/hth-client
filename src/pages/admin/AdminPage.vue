<template>
  <AdminLayout>
    <div class="funding-list-page">
      <div class="filter-tabs-container mb-2 shrink-0">
        <BaseTab :tabs="AdminTabs" v-model="currentAdminStatus" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto pb-24">
      <!-- props 전달 -->
      <AdminList
        v-if="currentAdminStatus === 'admin'"
        :list="propertyList"
        @approve="handleApprove"
        @reject="handleReject"
      />
      <AdminListCompleted v-else :list="propertyList" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminList from '@/components/admin/AdminList.vue'
import AdminListCompleted from '@/components/admin/AdminListCompleted.vue'

// 탭
const AdminTabs = [
  { label: '관리', value: 'admin' },
  { label: '완료', value: 'adminCompleted' },
]
const currentAdminStatus = ref('admin')

// 임시 목데이터
const propertyList = ref([
  {
    id: 1,
    title: '신도림 핀포인트타워 3호',
    address: '서울 강서구 등촌로 216',
    price: 1000000000,
    period: '12개월',
    image: '',
    status: '대기',
  },
  {
    id: 2,
    title: '신사역 코너 상가',
    address: '서울 강남구 논현로 216',
    price: 9000000000,
    period: '10개월',
    image: '',
    status: '대기',
  },
  {
    id: 3,
    title: '강남역 파이낸스센터',
    address: '서울 강남구 역삼로 123',
    price: 15000000000,
    period: '15개월',
    image: '',
    status: '대기',
  },
  {
    id: 4,
    title: '여의도 IFC몰',
    address: '서울 영등포구 여의대로 108',
    price: 20000000000,
    period: '18개월',
    image: '',
    status: '만료됨',
  },
  {
    id: 5,
    title: '판교 스타필드',
    address: '경기도 성남시 분당구 판교로 235',
    price: 12000000000,
    period: '24개월',
    image: '',
    status: '만료됨',
  },
])

function handleApprove(id) {
  const item = propertyList.value.find((p) => p.id === id)
  if (item) item.status = '승인됨'
}

function handleReject(id) {
  const item = propertyList.value.find((p) => p.id === id)
  if (item) item.status = '거절됨'
}

// function handleExpire(id) {
//   const item = propertyList.value.find((p) => p.id === id)
//   if (item) item.status = '만료됨'
// } --> 기간 만료 된 거 확인하고 당일 날짜 지났으면 완료로 넘어가는 함수 만들어야함
</script>
