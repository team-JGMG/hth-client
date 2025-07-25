<template>
  <div class="p-6 space-y-4" v-if="property">
    <div class="flex justify-between items-start">
      <div class="flex justify-between items-center gap-4">
        <span class="material-symbols-outlined text-2xl cursor-pointer" @click="goBack">
          chevron_left
        </span>
        <h2 class="text-xl font-bold">{{ property.title }}</h2>
      </div>
      <p class="text-sm text-gray-500 self-end">등록일: {{ formatDateTime(property.updatedAt) }}</p>
    </div>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매도자 정보</h3>
      <p>이름: {{ property.seller.name }}</p>
      <p>전화번호: {{ property.seller.phone }}</p>
      <p>이메일: {{ property.seller.email }}</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 정보</h3>
      <p>매물명: {{ property.title }}</p>
      <p>매물 주소: {{ property.address }}</p>
      <p>매물 면적: {{ property.area }}㎡({{ formatAreaToPyeong(property.area) }})</p>
      <p>희망 매매가: {{ formatPriceInManwon(property.price) }}</p>
      <p>희망 공모 기간: {{ property.postingPeriod }}개월</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물의 건축물 대장 정보</h3>
      <p>용도지역: {{ property.usageDistrict }}</p>
      <p>대지 면적(매물): {{ property.landArea }}㎡({{ formatAreaToPyeong(property.landArea) }})</p>
      <p>
        대지 면적(건물): {{ property.buildingArea }}㎡({{
          formatAreaToPyeong(property.buildingArea)
        }})
      </p>
      <p>
        연면적(매물): {{ property.totalFloorAreaProperty }}㎡({{
          formatAreaToPyeong(property.totalFloorAreaProperty)
        }})
      </p>
      <p>
        연면적(건물): {{ property.totalFloorAreaBuilding }}㎡({{
          formatAreaToPyeong(property.totalFloorAreaBuilding)
        }})
      </p>
      <p>건물 규모: 지하 {{ property.basementFloors }}층 / 지상 {{ property.groundFloors }}층</p>
      <p>준공일: {{ formatDateTime(property.createdAt) }}</p>
      <p>공시지가: {{ formatPriceInManwon(property.officialLandPrice) }}</p>
      <p>연면적 평단가(평/공모금액 기준): {{ formatPriceInManwon(property.unitPricePerPyeong) }}</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 상세 정보</h3>
      <p>방 수: {{ property.roomCount }}개</p>
      <p>욕실 수: {{ property.bathroomCount }}개</p>
      <p>해당 층 수: {{ property.floor }}층</p>
      <p>해시 태그: #역세권 #신축</p>
      <p>세부 정보: {{ property.description }}</p>
      <p>
        이미지:
        <img
          :src="property.thumbnail.photoUrl"
          class="w-full max-w-sm border rounded-md"
          alt="대표 이미지"
        />
      </p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 서류</h3>
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
</template>

<script setup>
import { formatDateTime, formatPriceInManwon, formatAreaToPyeong } from '@/utils/format'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyAdmin } from '@/stores/propertyadmin'

import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

const route = useRoute()
const propertyId = computed(() => Number(route.params.id))
const { propertyList } = usePropertyAdmin()

const property = computed(() => propertyList.find((p) => p.id === propertyId.value))
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
