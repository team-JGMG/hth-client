<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <div v-if="loading">
      <p>로딩 중...</p>
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-if="property">
      <DetailHeader size="xl" weight="bold">{{ property.title }}</DetailHeader>

      <section class="bg-white px-2">
        <BaseTypography class="self-end" size="sm" color="gray-2">
          등록일: {{ formatDateTime(property.createdAt) }}
        </BaseTypography>
      </section>

      <AdminDetailSellerInfo :seller="property.seller" />
      <AdminDetailPropertyInfo :property="property" />
      <AdminDetailBuildingLedger :property="property" />
      <AdminDetailExtraInfo :property="property" />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPropertyDetail } from '@/api/admin'
import { formatDateTime } from '@/utils/format'

import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import AdminDetailSellerInfo from '@/components/admin/detail/AdminDetailSellerInfo.vue'
import AdminDetailPropertyInfo from '@/components/admin/detail/AdminDetailPropertyInfo.vue'
import AdminDetailBuildingLedger from '@/components/admin/detail/AdminDetailBuildingLedger.vue'
import AdminDetailExtraInfo from '@/components/admin/detail/AdminDetailExtraInfo.vue'

const route = useRoute()
const propertyId = Number(route.params.id)

const property = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetchPropertyDetail(propertyId)

    const raw = res.data

    const fallbackImages = [
      '/src/assets/images/cardtestimage.png',
      '/src/assets/images/sample-buliding.png',
    ]

    if (!raw.photos || raw.photos.length === 0) {
      raw.photos = fallbackImages.map((url) => ({ photoUrl: url }))
    }

    property.value = {
      ...raw,
      images: raw.photos,
    }
  } catch {
    error.value = '상세 정보 불러오기 실패'
  } finally {
    loading.value = false
  }
})
</script>
