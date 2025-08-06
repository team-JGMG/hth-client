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

  const documentFiles = ref([])
  const documentTypes = ref([])
  const photoFiles = ref([])

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
    documentFiles,
    documentTypes,
    photoFiles,
    goToNextStep,
    goToPrevStep,
  }
})
