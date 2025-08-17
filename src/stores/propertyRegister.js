import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyRegisterStore = defineStore('propertyRegister', () => {
  const step = ref(1)

  const ownerInfo = ref({
    userId: '',
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
    period: '',
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

  const resetStore = () => {
    step.value = 1
    ownerInfo.value = {
      userId: '',
      agreements: {
        terms: false,
        privacy: false,
        age: false,
      },
    }
    propertyBasic.value = {
      title: '',
      rawdCd: '',
      address: '',
      detailAddress: '',
      size: '',
      price: '',
      period: '',
    }
    propertyBuilding.value = {
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
    }
    propertyDetail.value = {
      type: '',
      roomCount: '',
      bathroomCount: '',
      floor: '',
      options: [],
      memo: '',
    }
    documentFiles.value = []
    documentTypes.value = []
    photoFiles.value = []
    documents.value = []
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
    resetStore,
  }
})
