import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyRegisterStore = defineStore('propertyRegister', () => {
  const step = ref(1)

  const ownerInfo = ref({
    name: '',
    phone: '',
    email: '',
    agreements: {
      terms: false,
      privacy: false,
      age: false,
    },
  })

  const propertyBasic = ref({
    title: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    size: '',
    price: '',
    period: '', // 날짜 문자열 (ex: 2024-08-15)
  })

  const propertyBuilding = ref({
    landUsageZone: '', // 용도 지역
    landSize: '', // 대지 면적 (매물)
    buildingSize: '', // 대지 면적 (건물)
    landTotalArea: '', // 연면적 (매물)
    buildingTotalArea: '', // 연면적 (건물)
    floorUnder: '', // 지하 층수
    floorAbove: '', // 지상 층수
    builtDate: '', // 준공일
    officialPrice: '', // 공시지가
    marketPrice: '', // 연면적 평단가
  })

  const propertyDetail = ref({
    type: '', // 매물 유형
    roomCount: '', // 방 수
    bathroomCount: '', // 욕실 수
    floor: '', // 해당 층 수
    options: [], // 해시태그 (배열)
    memo: '', // 세부 설명
  })

  const documents = ref([])

  const goToNextStep = () => {
    if (step.value < 5) step.value++
  }

  const goToPrevStep = () => {
    if (step.value > 1) step.value--
  }

  return {
    step,
    ownerInfo,
    propertyBasic,
    propertyBuilding,
    propertyDetail,
    documents,
    goToNextStep,
    goToPrevStep,
  }
})
