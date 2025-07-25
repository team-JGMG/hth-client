// stores/property.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyAdmin = defineStore('propertyadmin', () => {
  const propertyList = ref([])

  // 매물 목록 설정
  function setPropertyList(data) {
    propertyList.value = data
  }

  // ID로 특정 매물 조회
  function getPropertyById(id) {
    return propertyList.value.find((p) => p.id === id)
  }

  // 초기 mock 데이터
  function initializeMockData() {
    propertyList.value = [
      // 대기 상태 2개
      {
        id: 1,
        title: '강남 오피스텔',
        address: '서울 강남구 테헤란로 123',
        price: 750000000,
        period: '2025-08-23',
        image: '',
        status: '대기',
        approvalDate: '2025-07-23',
        area: 84,
        basementFloors: 1,
        bathroomCount: 2,
        buildingArea: 234.56,
        createdAt: '2025-07-23T12:00:00',
        description: '역세권이며 투자 가치가 높습니다.',
        documents: [
          {
            documentType: 'OWNERSHIP_CERTIFICATE',
            fileUrl: 'https://example.com/ownership.pdf',
          },
          {
            documentType: 'SEAL_CERTIFICATE',
            fileUrl: 'https://example.com/seal.pdf',
          },
          {
            documentType: 'POWER_OF_ATTORNEY',
            fileUrl: 'https://example.com/power.pdf',
          },
          {
            documentType: 'RESIDENT_REGISTRATION',
            fileUrl: 'https://example.com/resident.pdf',
          },
          {
            documentType: 'ID_COPY',
            fileUrl: 'https://example.com/id.pdf',
          },
          {
            documentType: 'STANDARD_CONTRACT',
            fileUrl: 'https://example.com/standard.pdf',
          },
          {
            documentType: 'LEASE_CONTRACT',
            fileUrl: 'https://example.com/lease.pdf',
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
        postingPeriod: 24,
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
        thumbnail: {
          photoUrl: 'https://example.com/image.jpg',
        },
        totalFloorAreaBuilding: 1000,
        totalFloorAreaProperty: 200,
        unitPricePerPyeong: 25000000,
        updatedAt: '2025-07-24T09:30:00',
        usageDistrict: '제2종 일반주거지역',
        userId: 1,
      },
      {
        id: 2,
        title: '성수동 복층 상가',
        address: '서울 성동구 성수일로 99',
        price: 850000000,
        period: '2025-09-01',
        image: '',
        status: '대기',
        approvalDate: '2025-07-24',
        area: 66,
        basementFloors: 0,
        bathroomCount: 1,
        buildingArea: 150.12,
        createdAt: '2025-07-20T09:30:00',
        description: '성수 핫플 중심상권 복층 구조.',
        documents: [
          {
            documentType: 'OWNERSHIP_CERTIFICATE',
            fileUrl: 'https://example.com/ownership.pdf',
          },
          {
            documentType: 'SEAL_CERTIFICATE',
            fileUrl: 'https://example.com/seal.pdf',
          },
          {
            documentType: 'POWER_OF_ATTORNEY',
            fileUrl: 'https://example.com/power.pdf',
          },
          {
            documentType: 'RESIDENT_REGISTRATION',
            fileUrl: 'https://example.com/resident.pdf',
          },
          {
            documentType: 'ID_COPY',
            fileUrl: 'https://example.com/id.pdf',
          },
          {
            documentType: 'STANDARD_CONTRACT',
            fileUrl: 'https://example.com/standard.pdf',
          },
          {
            documentType: 'LEASE_CONTRACT',
            fileUrl: 'https://example.com/lease.pdf',
          },
        ],
        floor: 2,
        fundingEndDate: '2025-09-01',
        fundingStartDate: '2025-07-25',
        groundFloors: 5,
        landArea: 80.5,
        officialLandPrice: 380000000,
        photos: [{ photoUrl: 'https://example.com/image2.jpg' }],
        postingPeriod: 12,
        propertyId: 2,
        propertyType: '상가',
        roomCount: 1,
        seller: {
          email: 'kim@example.com',
          name: '김성수',
          phone: '010-5678-1234',
          userId: 2,
        },
        soldAt: null,
        thumbnail: { photoUrl: 'https://example.com/image2.jpg' },
        totalFloorAreaBuilding: 300,
        totalFloorAreaProperty: 90,
        unitPricePerPyeong: 21000000,
        updatedAt: '2025-07-24T11:00:00',
        usageDistrict: '상업지역',
        userId: 2,
      },

      // 승인됨 상태 1개
      {
        id: 3,
        title: '역삼 럭셔리 오피스텔',
        address: '서울 강남구 역삼동 777',
        price: 1200000000,
        period: '2025-09-15',
        image: '',
        status: '승인됨',
        approvalDate: '2025-07-22',
        area: 100,
        basementFloors: 2,
        bathroomCount: 2,
        buildingArea: 300,
        createdAt: '2025-07-18T08:00:00',
        description: '고급 인테리어, 대형 평수.',
        documents: [
          {
            documentType: 'OWNERSHIP_CERTIFICATE',
            fileUrl: 'https://example.com/ownership.pdf',
          },
          {
            documentType: 'SEAL_CERTIFICATE',
            fileUrl: 'https://example.com/seal.pdf',
          },
          {
            documentType: 'POWER_OF_ATTORNEY',
            fileUrl: 'https://example.com/power.pdf',
          },
          {
            documentType: 'RESIDENT_REGISTRATION',
            fileUrl: 'https://example.com/resident.pdf',
          },
          {
            documentType: 'ID_COPY',
            fileUrl: 'https://example.com/id.pdf',
          },
          {
            documentType: 'STANDARD_CONTRACT',
            fileUrl: 'https://example.com/standard.pdf',
          },
          {
            documentType: 'LEASE_CONTRACT',
            fileUrl: 'https://example.com/lease.pdf',
          },
        ],
        floor: 12,
        fundingEndDate: '2025-09-15',
        fundingStartDate: '2025-07-22',
        groundFloors: 20,
        landArea: 160,
        officialLandPrice: 550000000,
        photos: [{ photoUrl: 'https://example.com/image3.jpg' }],
        postingPeriod: 36,
        propertyId: 3,
        propertyType: '오피스텔',
        roomCount: 4,
        seller: {
          email: 'lux@example.com',
          name: '이럭셔리',
          phone: '010-8888-8888',
          userId: 3,
        },
        soldAt: '2025-09-16T15:00:00',
        thumbnail: { photoUrl: 'https://example.com/image3.jpg' },
        totalFloorAreaBuilding: 500,
        totalFloorAreaProperty: 150,
        unitPricePerPyeong: 30000000,
        updatedAt: '2025-07-24T12:00:00',
        usageDistrict: '일반상업지역',
        userId: 3,
      },

      // 만료 상태 2개
      {
        id: 4,
        title: '마곡지구 상가',
        address: '서울 강서구 마곡동 123',
        price: 680000000,
        period: '2025-06-30',
        image: '',
        status: '만료됨',
        approvalDate: '2025-06-01',
        area: 55,
        basementFloors: 0,
        bathroomCount: 1,
        buildingArea: 120,
        createdAt: '2025-05-30T10:00:00',
        description: '유동인구 풍부한 지역.',
        documents: [
          {
            documentType: 'OWNERSHIP_CERTIFICATE',
            fileUrl: 'https://example.com/ownership.pdf',
          },
          {
            documentType: 'SEAL_CERTIFICATE',
            fileUrl: 'https://example.com/seal.pdf',
          },
          {
            documentType: 'POWER_OF_ATTORNEY',
            fileUrl: 'https://example.com/power.pdf',
          },
          {
            documentType: 'RESIDENT_REGISTRATION',
            fileUrl: 'https://example.com/resident.pdf',
          },
          {
            documentType: 'ID_COPY',
            fileUrl: 'https://example.com/id.pdf',
          },
          {
            documentType: 'STANDARD_CONTRACT',
            fileUrl: 'https://example.com/standard.pdf',
          },
          {
            documentType: 'LEASE_CONTRACT',
            fileUrl: 'https://example.com/lease.pdf',
          },
        ],
        floor: 1,
        fundingEndDate: '2025-06-30',
        fundingStartDate: '2025-06-01',
        groundFloors: 4,
        landArea: 100,
        officialLandPrice: 310000000,
        photos: [{ photoUrl: 'https://example.com/image4.jpg' }],
        postingPeriod: 18,
        propertyId: 4,
        propertyType: '상가',
        roomCount: 1,
        seller: {
          email: 'lee@example.com',
          name: '이마곡',
          phone: '010-9999-0000',
          userId: 4,
        },
        soldAt: '2025-07-01T10:00:00',
        thumbnail: { photoUrl: 'https://example.com/image4.jpg' },
        totalFloorAreaBuilding: 250,
        totalFloorAreaProperty: 70,
        unitPricePerPyeong: 18000000,
        updatedAt: '2025-07-01T10:30:00',
        usageDistrict: '준주거지역',
        userId: 4,
      },
      {
        id: 5,
        title: '판교 테크노밸리 오피스',
        address: '경기도 성남시 분당구 판교로 10',
        price: 5000000000,
        period: '2025-05-20',
        image: '',
        status: '만료됨',
        approvalDate: '2025-05-01',
        area: 150,
        basementFloors: 1,
        bathroomCount: 2,
        buildingArea: 600,
        createdAt: '2025-04-28T09:00:00',
        description: 'IT 기업 밀집 지역.',
        documents: [
          {
            documentType: 'OWNERSHIP_CERTIFICATE',
            fileUrl: 'https://example.com/ownership.pdf',
          },
          {
            documentType: 'SEAL_CERTIFICATE',
            fileUrl: 'https://example.com/seal.pdf',
          },
          {
            documentType: 'POWER_OF_ATTORNEY',
            fileUrl: 'https://example.com/power.pdf',
          },
          {
            documentType: 'RESIDENT_REGISTRATION',
            fileUrl: 'https://example.com/resident.pdf',
          },
          {
            documentType: 'ID_COPY',
            fileUrl: 'https://example.com/id.pdf',
          },
          {
            documentType: 'STANDARD_CONTRACT',
            fileUrl: 'https://example.com/standard.pdf',
          },
          {
            documentType: 'LEASE_CONTRACT',
            fileUrl: 'https://example.com/lease.pdf',
          },
        ],
        floor: 7,
        fundingEndDate: '2025-05-20',
        fundingStartDate: '2025-05-01',
        groundFloors: 10,
        landArea: 250,
        officialLandPrice: 720000000,
        photos: [{ photoUrl: 'https://example.com/image5.jpg' }],
        postingPeriod: 24,
        propertyId: 5,
        propertyType: '오피스',
        roomCount: 6,
        seller: {
          email: 'choi@example.com',
          name: '최판교',
          phone: '010-0000-0000',
          userId: 5,
        },
        soldAt: '2025-05-25T10:00:00',
        thumbnail: { photoUrl: 'https://example.com/image5.jpg' },
        totalFloorAreaBuilding: 800,
        totalFloorAreaProperty: 300,
        unitPricePerPyeong: 45000000,
        updatedAt: '2025-05-26T11:00:00',
        usageDistrict: '일반공업지역',
        userId: 5,
      },
    ]
  }

  return {
    propertyList,
    setPropertyList,
    getPropertyById,
    initializeMockData,
  }
})
