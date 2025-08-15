<template>
  <main class="py-6 px-6 w-full bg-white text-black relative">
    <div v-if="property">
      <DetailHeader size="xl" weight="bold">{{ property.title }}</DetailHeader>

      <section class="bg-white px-2">
        <BaseTypography class="self-end" size="sm" color="gray-2">
          등록일: {{ formatDateTime(property.createdAt) }}
        </BaseTypography>
      </section>

      <!-- 매도자 정보 -->
      <section v-if="property.seller" class="mt-1 px-2 bg-white">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매도자 정보</BaseTypography>
        <div class="px-1 pb-2">
          <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >이름</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              property.seller?.name || '-'
            }}</BaseTypography>

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >전화번호</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              property.seller?.phone || '-'
            }}</BaseTypography>

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >이메일</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              property.seller?.email || '-'
            }}</BaseTypography>
          </div>
        </div>
      </section>

      <!-- 매물 정보 -->
      <section class="mt-4 px-2 bg-white">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 정보</BaseTypography>
        <div class="px-1 pb-2">
          <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >매물명</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{ property.title }}</BaseTypography>

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >매물 주소</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ property.address }}</BaseTypography
            >

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >매물 면적</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2"
              >{{ property.area }}㎡({{ formatAreaToPyeong(property.area) }})</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >희망 매매가</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              formatPriceInManwon(property.price)
            }}</BaseTypography>
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >희망 공모 기간</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2"
              >{{ property.postingPeriod }}개월</BaseTypography
            >
          </div>
        </div>
      </section>

      <!-- 매물의 건축물 대장 정보 -->
      <section class="mt-4 px-2 bg-white">
        <BaseTypography class="mb-2" weight="semibold" size="lg"
          >매물의 건축물 대장 정보</BaseTypography
        >
        <div class="px-1 pb-2">
          <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >용도지역</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              property.usageDistrict
            }}</BaseTypography>

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >대지 면적(매물)</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ property.landArea }}㎡({{ formatAreaToPyeong(property.landArea) }})</BaseTypography
            >

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >대지 면적(건물)</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2"
              >{{ property.buildingArea }}㎡({{
                formatAreaToPyeong(property.buildingArea)
              }})</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >연면적(매물)</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2"
              >{{ property.totalFloorAreaProperty }}㎡({{
                formatAreaToPyeong(property.totalFloorAreaProperty)
              }})</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >연면적(건물)</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ property.totalFloorAreaBuilding }}㎡({{
                formatAreaToPyeong(property.totalFloorAreaBuilding)
              }})</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >건물 규모</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              지하 {{ property.basementFloors }}층 / 지상
              {{ property.groundFloors }}층</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >준공일</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ formatDate(property.approvalDate) }}</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >공시지가</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ formatPriceInManwon(property.officialLandPrice) }}</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >연면적 평단가
              <span class="text-xs text-gray-500">(평/공모금액 기준)</span></BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ formatPriceInManwon(property.unitPricePerPyeong) }}</BaseTypography
            >
          </div>
        </div>
      </section>

      <!-- 매물 상세 정보 -->
      <section class="mt-4 px-2 bg-white">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 상세 정보</BaseTypography>
        <div class="px-1 pb-2">
          <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >방 수</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ property.roomCount }}개</BaseTypography
            >

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >욕실 수</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              {{ property.bathroomCount }}개</BaseTypography
            >

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >해당 층 수</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2"
              >{{ property.floor }}층</BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >해시 태그</BaseTypography
            >
            <BaseTypography
              weight="regular"
              class="px-3 py-2 flex flex-wrap gap-1"
              v-if="normalizedTags.length"
            >
              <span
                v-for="(tag, i) in normalizedTags"
                :key="tag + '-' + i"
                class="bg-gray-100 px-1.5 py-1 rounded-full text-xs text-gray-600"
                :title="tag"
              >
                #{{ tag }}
              </span></BaseTypography
            >
            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >세부 정보</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">{{
              property.description
            }}</BaseTypography>

            <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
              >이미지</BaseTypography
            >
            <BaseTypography weight="regular" class="px-3 py-2">
              <template v-if="property.images?.length">
                <ul class="list-none space-y-1">
                  <li v-for="(img, i) in property.images" :key="img.photoUrl">
                    <a
                      :href="img.photoUrl"
                      class="text-blue-600 underline break-all"
                      target="_blank"
                      :download="`${property.title}_이미지` || `image-${i + 1}`"
                    >
                      {{ `${property.title} 이미지 ` || `image-${i + 1}` }}
                    </a>
                  </li>
                </ul>
              </template>
              <span v-else class="text-gray-500">등록된 이미지가 없습니다.</span>
            </BaseTypography>
          </div>
        </div>
      </section>

      <!-- 매물 서류 -->
      <section v-if="property.seller" class="mt-4 px-2 bg-white">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 서류</BaseTypography>
        <div class="px-1 pb-2">
          <div class="p-4 grid text-sm border rounded-md overflow-hidden">
            <ul>
              <li v-for="doc in property.documents" :key="doc.fileUrl">
                <a
                  :href="doc.fileUrl"
                  class="text-blue-500 underline pb-3"
                  target="_blank"
                  :download="getDocumentName(doc.documentType)"
                >
                  {{ getDocumentName(doc.documentType) }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPropertyDetail } from '@/api/admin'
import { formatDate, formatDateTime, formatPriceInManwon, formatAreaToPyeong } from '@/utils/format'

import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

import DetailHeader from '@/layouts/DetailHeader.vue'

const route = useRoute()
const propertyId = Number(route.params.id)

const property = ref(null)
const loading = ref(true)
const error = ref(null)

//해시태그
const maxTagsToShow = 6
const normalizedTags = computed(() => {
  const raw = Array.isArray(property.value?.tags) ? property.value.tags : []
  return raw
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter((t) => t.length > 0)
    .slice(0, maxTagsToShow)
})

function getDocumentName(type) {
  switch (type) {
    case 'OWNERSHIP_CERTIFICATE':
      return '등기권리증'
    case 'SEAL_CERTIFICATE':
      return '매도용 인감증명서'
    case 'POWER_OF_ATTORNEY':
      return '위임장'
    case 'RESIDENT_REGISTRATION':
      return '주민등록등본'
    case 'ID_COPY':
      return '신분증 사본'
    case 'STANDARD_CONTRACT':
      return '표준부동산매매계약서'
    case 'LEASE_CONTRACT':
      return '임대차 계약서'
    default:
      return '기타 문서'
  }
}

onMounted(async () => {
  try {
    const res = await fetchPropertyDetail(propertyId)
    console.log('✅ 응답 결과:', res)

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
  } catch (err) {
    error.value = '상세 정보 불러오기 실패'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
