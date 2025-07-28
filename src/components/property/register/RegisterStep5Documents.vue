<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6"> 매물 관련 서류를 입력해주세요. </BaseTypography>

    <div v-for="(doc, index) in documentFields" :key="index" class="mb-6">
      <BaseTypography class="mb-1 text-sm font-medium">{{ doc.label }}</BaseTypography>

      <div class="flex items-center justify-between border-b py-2">
        <span class="text-gray-500 text-sm">
          {{ documents[index]?.name || '파일명.jpg' }}
        </span>
        <label class="cursor-pointer">
          <input type="file" class="hidden" @change="handleFileUpload($event, index)" />
          <span class="material-symbols-outlined text-gray-400">attach_file</span>
        </label>
      </div>
    </div>

    <BaseButton class="w-full mt-10 py-3 rounded font-semibold" @click="handleSubmit">
      등록하기
    </BaseButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
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
