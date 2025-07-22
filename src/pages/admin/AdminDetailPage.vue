<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">{{ property.title }}</h2>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 정보</h3>
      <p>주소: {{ property.address }}</p>
      <p>면적: {{ property.area }}</p>
      <p>희망 매각가: {{ formatPrice(property.price) }}</p>
      <p>공모 기간: {{ property.fundingStartDate }} ~ {{ property.fundingEndDate }}</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">건축 정보</h3>
      <p>지하/지상층: 지하 {{ property.basementFloors }}층 / 지상 {{ property.groundFloors }}층</p>
      <p>용도지역: {{ property.usageDistrict }}</p>
      <p>건축 승인일: {{ property.approvalDate }}</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 상세</h3>
      <p>용도: {{ property.propertyType }}</p>
      <p>방: {{ property.roomCount }}개 / 욕실: {{ property.bathroomCount }}개</p>
      <p>층수: {{ property.floor }}</p>
      <p>비고: {{ property.description }}</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">첨부 서류</h3>
      <ul>
        <li v-for="doc in property.documents" :key="doc.fileUrl">
          <a :href="doc.fileUrl" class="text-blue-500 underline" target="_blank">
            {{ getDocumentName(doc.documentType) }}
          </a>
        </li>
      </ul>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">대표 이미지</h3>
      <img
        :src="property.photos.find((p) => p.isThumbnail)?.photoUrl"
        class="w-full max-w-sm border rounded-md"
        alt="대표 이미지"
      />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const property = ref({
  propertyId: 101,
  title: '삼성역 인근 상가',
  address: '서울시 강남구 삼성동 123-45',
  area: '132m²',
  price: 8500000000,
  fundingStartDate: '2025-08-01',
  fundingEndDate: '2025-08-31',
  usageDistrict: '상업지역',
  landArea: 132.0,
  buildingArea: 210.5,
  totalFloorAreaProperty: 210.5,
  totalFloorAreaBuilding: 550.75,
  basementFloors: 1,
  groundFloors: 4,
  approvalDate: '2019-06-30',
  officialLandPrice: 425000000,
  unitPricePerPyeong: 25000000,
  propertyType: '근린생활시설',
  roomCount: 4,
  bathroomCount: 2,
  floor: 2,
  description: '삼성역 도보 3분 거리, 공실 없음',
  documents: [
    {
      documentType: 'OWNERSHIP_CERTIFICATE',
      fileUrl: 'https://s3.hth.com/docs/property101_cert.pdf',
    },
    {
      documentType: 'RESIDENT_REGISTRATION',
      fileUrl: 'https://s3.hth.com/docs/property101_rrn.pdf',
    },
  ],
  photos: [
    {
      photoUrl: 'https://s3.hth.com/photos/property101_main.jpg',
      isThumbnail: true,
    },
    {
      photoUrl: 'https://s3.hth.com/photos/property101_sub.jpg',
      isThumbnail: false,
    },
  ],
})

function formatPrice(val) {
  return val ? `${(val / 10000).toLocaleString()}만원` : '-'
}

function getDocumentName(type) {
  switch (type) {
    case 'OWNERSHIP_CERTIFICATE':
      return '등기부등본'
    case 'RESIDENT_REGISTRATION':
      return '주민등록등본'
    default:
      return type
  }
}
</script>
