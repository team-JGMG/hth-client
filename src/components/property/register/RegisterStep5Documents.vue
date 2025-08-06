<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-3">매물 관련 서류를 입력해주세요.</BaseTypography>

    <!-- 안내 멘트 -->
    <BaseTypography class="mb-12" size="xs" color="gray-1">
      아래 서류들을 정확히 첨부해주세요. 미첨부 시 등록이 제한될 수 있습니다.
    </BaseTypography>

    <div v-for="(doc, index) in documentFields" :key="index" class="mb-12 relative">
      <BaseTypography class="mb-1 text-base font-medium">{{ doc.label }}</BaseTypography>

      <label
        class="flex items-center justify-between w-full cursor-pointer border-b border-gray-400 py-2 text-base text-gray-700"
      >
        <span class="truncate">
          {{ documents[index]?.name || ' 파일 선택' }}
        </span>

        <input type="file" class="hidden" @change="handleFileUpload($event, index)" />
        <span class="material-symbols-outlined text-gray-500">attach_file</span>
      </label>

      <!-- 유효성 안내문구 -->
      <BaseTypography
        v-if="submitTried && !documents[index]"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 등록하기 버튼 -->
    <div class="pb-28">
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleSubmit"
      >
        등록하기
      </CompletedButton>
    </div>

    <!-- 확인 모달 -->
    <BaseModal :isOpen="showConfirmModal" @close="showConfirmModal = false">
      <template #default>
        <div class="p-4 pb-0">
          <BaseTypography class="mb-4" size="xl" weight="bold">
            아래 정보가 맞는지 확인해주세요.
          </BaseTypography>
          <BaseTypography size="base" color="gray-1" class="text-start mb-0">
            매물명: {{ store.propertyBasic.title }}
            <br />
            주소: {{ store.propertyBasic.address }} {{ store.propertyBasic.detailAddress }}
            <br />
            매물 크기: {{ store.propertyBasic.size }}㎡
            <br />
            희망 매매가: {{ store.propertyBasic.price }}원
          </BaseTypography>
        </div>
      </template>
      <template #submit>
        <CompletedButton
          :color="isStepValid ? 'black' : 'gray-300'"
          :text-color="isStepValid ? 'white' : 'gray-400'"
          :active-color="isStepValid ? 'gray-700' : 'gray-300'"
          :disabled="!isStepValid"
          class="w-full font-semibold py-3"
          @click="handleFinalSubmit"
        >
          최종 등록하기
        </CompletedButton>
      </template>
    </BaseModal>

    <!-- 완료 모달 -->
    <CompletedModal
      :isOpen="showCompleteModal"
      @close="showCompleteModal = false"
      @submit="goToMyPage"
    >
      매물이 성공적으로 등록되었습니다.

      <template #submitText> 완료 </template>
    </CompletedModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import CompletedModal from '@/components/common/Modal/CompletedModal.vue'

import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import { registerPropertyWithFormData } from '@/api/property'

const store = usePropertyRegisterStore()
const router = useRouter()

//문서 첨부 항목 정의
const documentFields = [
  { label: '등기권리증' },
  { label: '매도용 인감증명서' },
  { label: '위임장' },
  { label: '주민등록등본' },
  { label: '신분증 사본' },
  { label: '표준부동산매매계약서' },
  { label: '임대차계약서' },
]

//각 첨부된 파일 저장
const documents = ref(Array(documentFields.length).fill(null))
const submitTried = ref(false)

const showConfirmModal = ref(false)
const showCompleteModal = ref(false)

const isStepValid = computed(() => documents.value.every((file) => !!file))

//파일 업로드 핸들러
const handleFileUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    documents.value[index] = file
  }
}

//등록하기 클릭 시 (확인 모달 열기)
const handleSubmit = () => {
  submitTried.value = true
  if (!isStepValid.value) return
  showConfirmModal.value = true
}

//최종 등록 요청
const handleFinalSubmit = async () => {
  try {
    store.documentFiles = documents.value.map((doc) => doc)
    store.documentTypes = documentFields.map((field) => field.label)

    const requestBody = {
      userId: parseInt(store.ownerInfo.userId),
      title: store.propertyBasic.title,
      rawdCd: store.propertyBasic.rawdCd,
      address: `${store.propertyBasic.address} ${store.propertyBasic.detailAddress}`,
      area: parseFloat(store.propertyBasic.size),
      price: parseFloat(store.propertyBasic.price),
      postingPeriod: parseInt(store.propertyBasic.period),

      usageDistrict: store.propertyBuilding.landUsageZone,
      landArea: parseFloat(store.propertyBuilding.landSize),
      buildingArea: parseFloat(store.propertyBuilding.buildingSize),
      totalFloorAreaProperty: parseFloat(store.propertyBuilding.landTotalArea),
      totalFloorAreaBuilding: parseFloat(store.propertyBuilding.buildingTotalArea),
      basementFloors: parseInt(store.propertyBuilding.floorUnder),
      groundFloors: parseInt(store.propertyBuilding.floorAbove),
      approvalDate: store.propertyBuilding.builtDate,
      officialLandPrice: parseFloat(store.propertyBuilding.officialPrice),
      unitPricePerPyeong: parseFloat(store.propertyBuilding.marketPrice),

      propertyType: store.propertyDetail.type,
      roomCount: parseInt(store.propertyDetail.roomCount),
      bathroomCount: parseInt(store.propertyDetail.bathroomCount),
      floor: parseInt(store.propertyDetail.floor),
      description: store.propertyDetail.memo,
      rentalIncome: 0,
    }

    await registerPropertyWithFormData({
      requestData: requestBody,
      photoFiles: store.photoFiles,
      documentFiles: store.documentFiles,
      documentTypes: store.documentTypes,
    })

    showConfirmModal.value = false
    showCompleteModal.value = true
  } catch (err) {
    console.error('매물 등록 실패:', err)
    alert('매물 등록 중 오류가 발생했습니다.')
  }
}

// 완료 후 마이페이지 이동
const goToMyPage = () => {
  router.push('/account/my-page/listings')
  showCompleteModal.value = false
}
</script>
