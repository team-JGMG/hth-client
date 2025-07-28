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

  const buildingInfo = ref({
    usage: '',
    yearBuilt: '',
    totalFloors: '',
    structure: '',
  })

  const propertyDetail = ref({
    type: '',
    price: '',
    options: [],
    memo: '',
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
    buildingInfo,
    propertyDetail,
    documents,
    goToNextStep,
    goToPrevStep,
  }
})
