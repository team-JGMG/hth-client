<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">{{ property.title }}</h2>

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
      <p>매물 면적: {{ property.area }}㎡</p>
      <p>희망 매매가: {{ formatPrice(property.price) }}</p>
      <!-- 임시로 받음 (수정필요-나중에 개월 숫자 받음) -->
      <p>희망 공모 기간: {{ property.fundingEndDate }}개월</p>
    </section>

    <!-- 여기 밑으로 값 다 변경 필요(DB에서 받아오는 값으로 변경 필요) -->
    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물의 건축물 대장 정보</h3>
      <p>용도지역: {{ property.propertyType }}</p>
      <p>대지 면적(매물): {{ property.roomCount }}㎡</p>
      <p>대지 면적(건물): {{ property.roomCount }}㎡</p>
      <p>연면적(매물): {{ property.roomCount }}㎡</p>
      <p>연면적(건물): {{ property.roomCount }}㎡</p>
      <p>건물 규모: 지하 {{ property.basementFloors }}층 / 지상 {{ property.groundFloors }}층</p>
      <p>준공일: {{ property.propertyType }}</p>
      <p>공시지가: {{ property.floor }}원/㎡</p>
      <p>연면적 평단가(평/공모금액 기준): {{ property.description }}원/평</p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 상세 정보</h3>
      <p>방 수: {{ property.roomCount }}개</p>
      <p>욕실 수: {{ property.bathroomCount }}개</p>
      <p>해당 층 수: {{ property.floor }}층</p>
      <p>해시 태그: {{ property.floor }}층</p>
      <p>세부 정보: {{ property.description }}</p>
      <p>
        이미지:
        <img
          :src="property.photos.find((p) => p.isThumbnail)?.photoUrl"
          class="w-full max-w-sm border rounded-md"
          alt="대표 이미지"
        />
      </p>
    </section>

    <section class="border p-4 rounded-lg bg-white">
      <h3 class="font-semibold mb-2">매물 서류</h3>
      <ul>
        <li v-for="doc in property.documents" :key="doc.fileUrl">
          <a :href="doc.fileUrl" class="text-blue-500 underline" target="_blank">
            {{ getDocumentName(doc.documentType) }}
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const property = ref({
  address: '서울 강남구 테헤란로 123',
  approvalDate: '2025-07-23',
  area: '84',
  basementFloors: 1,
  bathroomCount: 2,
  buildingArea: 234.56,
  createdAt: '2025-07-23T12:00:00',
  description: '역세권이며 투자 가치가 높습니다.',
  documents: [
    {
      documentType: 'LICENSE',
      fileUrl: 'https://example.com/document.pdf',
    },
  ],
  floor: 10,
  fundingEndDate: '2025-08-23',
  fundingStartDate: '2025-07-23',
  groundFloors: 15,
  landArea: 123.45,
  officialLandPrice: 400000000,
  photos: [
    {
      photoUrl: 'https://example.com/image.jpg',
    },
  ],
  price: 750000000,
  propertyId: 1,
  propertyType: '오피스텔',
  roomCount: 3,
  seller: {
    email: 'hong@example.com',
    name: '홍길동',
    phone: '010-1234-5678',
    userId: 1,
  },
  soldAt: '2025-08-01T17:00:00',
  status: 'PENDING',
  thumbnail: {
    photoUrl: 'https://example.com/image.jpg',
  },
  title: '강남 오피스텔',
  totalFloorAreaBuilding: 1000,
  totalFloorAreaProperty: 200,
  unitPricePerPyeong: 25000000,
  updatedAt: '2025-07-24T09:30:00',
  usageDistrict: '제2종 일반주거지역',
  userId: 1,
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
