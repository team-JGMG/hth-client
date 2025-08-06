import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyRegisterStore = defineStore('propertyRegister', () => {
  const step = ref(1)

  const ownerInfo = ref({
    userId: '', // 로그인한 사용자 ID
    agreements: {
      terms: false,
      privacy: false,
      age: false,
    },
  })

  const propertyBasic = ref({
    title: '',
    rawdCd: '',
    address: '',
    detailAddress: '',
    size: '',
    price: '',
    period: '', // 희망 공고 기간
  })

  const propertyBuilding = ref({
    landUsageZone: '',
    landSize: '',
    buildingSize: '',
    landTotalArea: '',
    buildingTotalArea: '',
    floorUnder: '',
    floorAbove: '',
    builtDate: '',
    officialPrice: '',
    marketPrice: '',
  })

  const propertyDetail = ref({
    type: '',
    roomCount: '',
    bathroomCount: '',
    floor: '',
    options: [],
    memo: '',
  })

  // 서류 파일 + 타입
  const documentFiles = ref<File[]>([])
  const documentTypes = ref<string[]>([])

  // 사진 파일
  const photoFiles = ref<File[]>([])

  // 기존 방식과의 호환을 위해 유지
  const documents = ref<{ type: string; file: File }[]>([])

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
    documentFiles,
    documentTypes,
    photoFiles,
    goToNextStep,
    goToPrevStep,
  }
})
