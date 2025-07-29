<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6"> 매물 관련 서류를 입력해주세요. </BaseTypography>

    <div v-for="(doc, index) in documentFields" :key="index" class="mb-12">
      <BaseTypography class="mb-1 text-base font-medium">{{ doc.label }}</BaseTypography>

      <div class="flex items-center justify-between border-b py-2">
        <span class="text-gray-500 text-base">
          {{ documents[index]?.name || '파일명.jpg' }}
        </span>
        <label class="cursor-pointer">
          <input type="file" class="hidden" @change="handleFileUpload($event, index)" />
          <span class="material-symbols-outlined text-gray-400">attach_file</span>
        </label>
      </div>
    </div>

    <!-- 등록하기 버튼 -->
    <div class="pb-28">
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleNext"
      >
        등록하기
      </CompletedButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = usePropertyRegisterStore()

const documentFields = [
  { label: '등기권리증' },
  { label: '매도용 인감증명서' },
  { label: '위임장' },
  { label: '주민등록등본' },
  { label: '신분증 사본' },
  { label: '표준부동산매매계약서' },
  { label: '임대차계약서' },
]

const documents = ref(Array(documentFields.length).fill(null))

const handleFileUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    documents.value[index] = file
  }
}

const handleSubmit = () => {
  // TODO: 파일 업로드 처리 (store.documents에 저장하거나 API 호출)
  store.documents = documents.value

  // 마이페이지로 이동
  router.push('/account/my-page')
}
</script>
