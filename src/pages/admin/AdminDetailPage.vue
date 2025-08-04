<template>
  <BlankLayout>
    <div v-if="property">
      <div class="flex justify-between items-start">
        <DetailHeader size="xl" weight="bold">{{ property.title }}</DetailHeader>
      </div>

      <section class="bg-white px-2">
        <BaseTypography class="self-end" size="sm" color="gray-2">
          등록일: {{ formatDateTime(property.updatedAt) }}
        </BaseTypography>
      </section>

      <section class="border p-4 rounded-lg bg-white mt-1">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매도자 정보</BaseTypography>
        <BaseTypography weight="regular">이름: {{ property.seller.name }}</BaseTypography>
        <BaseTypography weight="regular">전화번호: {{ property.seller.phone }}</BaseTypography>
        <BaseTypography weight="regular">이메일: {{ property.seller.email }}</BaseTypography>
      </section>

      <section class="border p-4 rounded-lg bg-white mt-4">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 정보</BaseTypography>
        <BaseTypography weight="regular">매물명: {{ property.title }}</BaseTypography>
        <BaseTypography weight="regular">매물 주소: {{ property.address }}</BaseTypography>
        <BaseTypography weight="regular"
          >매물 면적: {{ property.area }}㎡({{ formatAreaToPyeong(property.area) }})
        </BaseTypography>
        <BaseTypography weight="regular"
          >희망 매매가: {{ formatPriceInManwon(property.price) }}
        </BaseTypography>
        <BaseTypography weight="regular"
          >희망 공모 기간: {{ property.postingPeriod }}개월
        </BaseTypography>
      </section>

      <section class="border p-4 rounded-lg bg-white mt-4">
        <BaseTypography class="mb-2" weight="semibold" size="lg"
          >매물의 건축물 대장 정보</BaseTypography
        >
        <BaseTypography weight="regular">용도지역: {{ property.usageDistrict }}</BaseTypography>
        <BaseTypography weight="regular">
          대지 면적(매물): {{ property.landArea }}㎡({{ formatAreaToPyeong(property.landArea) }})
        </BaseTypography>
        <BaseTypography weight="regular">
          대지 면적(건물): {{ property.buildingArea }}㎡({{
            formatAreaToPyeong(property.buildingArea)
          }})
        </BaseTypography>
        <BaseTypography weight="regular">
          연면적(매물): {{ property.totalFloorAreaProperty }}㎡({{
            formatAreaToPyeong(property.totalFloorAreaProperty)
          }})
        </BaseTypography>
        <BaseTypography weight="regular">
          연면적(건물): {{ property.totalFloorAreaBuilding }}㎡({{
            formatAreaToPyeong(property.totalFloorAreaBuilding)
          }})
        </BaseTypography>
        <BaseTypography weight="regular"
          >건물 규모: 지하 {{ property.basementFloors }}층 / 지상
          {{ property.groundFloors }}층</BaseTypography
        >
        <BaseTypography weight="regular"
          >준공일: {{ formatDateTime(property.createdAt) }}</BaseTypography
        >
        <BaseTypography weight="regular"
          >공시지가: {{ formatPriceInManwon(property.officialLandPrice) }}</BaseTypography
        >
        <BaseTypography weight="regular"
          >연면적 평단가(평/공모금액 기준):
          {{ formatPriceInManwon(property.unitPricePerPyeong) }}</BaseTypography
        >
      </section>

      <section class="border p-4 rounded-lg bg-white mt-4">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 상세 정보</BaseTypography>
        <BaseTypography weight="regular">방 수: {{ property.roomCount }}개</BaseTypography>
        <BaseTypography weight="regular">욕실 수: {{ property.bathroomCount }}개</BaseTypography>
        <BaseTypography weight="regular">해당 층 수: {{ property.floor }}층</BaseTypography>
        <BaseTypography weight="regular">해시 태그: #역세권 #신축</BaseTypography>
        <BaseTypography weight="regular">세부 정보: {{ property.description }}</BaseTypography>
        <!-- <BaseTypography weight="regular">
        이미지:
        <img
          :src="property.thumbnail.photoUrl"
          class="w-full max-w-sm border rounded-md"
          alt="대표 이미지"
        />
      </BaseTypography> -->

        <BaseTypography weight="regular">
          이미지:
          <div class="relative w-full max-w-sm h-60 mt-2">
            <!-- 이미지 -->
            <img
              :src="property.images[currentImageIndex].photoUrl"
              class="w-full h-full object-contain border rounded-md mx-auto"
              alt="매물 이미지"
            />

            <!-- 좌우 터치 영역 -->
            <div class="absolute left-0 top-0 w-1/2 h-full cursor-pointer" @click="prevImage"></div>
            <div
              class="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
              @click="nextImage"
            ></div>

            <!-- 좌우 아이콘 (희미하게 보이도록) -->
            <span
              class="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-black/30 pointer-events-none select-none"
            >
              chevron_left
            </span>
            <span
              class="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-black/30 pointer-events-none select-none"
            >
              chevron_right
            </span>
          </div>
        </BaseTypography>
      </section>

      <section class="border p-4 rounded-lg bg-white mt-4 mb-16">
        <BaseTypography class="mb-2" weight="semibold" size="lg">매물 서류</BaseTypography>
        <ul>
          <li v-for="doc in property.documents" :key="doc.fileUrl">
            <a
              :href="doc.fileUrl"
              class="text-blue-500 underline"
              target="_blank"
              :download="getDocumentName(doc.documentType)"
            >
              {{ getDocumentName(doc.documentType) }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </BlankLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyAdmin } from '@/stores/propertyadmin'
import { formatDateTime, formatPriceInManwon, formatAreaToPyeong } from '@/utils/format'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'

const router = useRouter()

function goBack() {
  router.back()
}

const route = useRoute()
const propertyId = computed(() => Number(route.params.id))
const { propertyList } = usePropertyAdmin()

// current image index
const currentImageIndex = ref(0)
function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + property.value.images.length) % property.value.images.length
}
function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % property.value.images.length
}

// property + 이미지 mock 삽입
const property = computed(() => {
  const original = propertyList.find((p) => p.id === propertyId.value)
  if (!original) return null

  const mockImages = [
    '/src/assets/images/cardtestimage.png',
    '/src/assets/images/sample-buliding.png',
    '/src/assets/images/mockup.png',
    '/src/assets/images/logo.png',
    '/src/assets/images/DeleteUser.png',
  ]

  return {
    ...original,
    images: mockImages.map((url) => ({ photoUrl: url })),
  }
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
</script>
