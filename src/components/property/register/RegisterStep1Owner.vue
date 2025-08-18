<template>
  <div class="w-full max-w-md mx-auto px-4 pb-8">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      매도자 정보를 확인해주세요.
    </BaseTypography>

    <div class="mb-10 relative">
      <label class="text-base font-medium">이름</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.name ? store.ownerInfo.name : '-' }}
      </div>
    </div>

    <div class="mb-12 relative">
      <label class="text-base font-medium">전화번호</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.phone ? formatPhoneNumber(store.ownerInfo.phone) : '-' }}
      </div>
    </div>

    <div class="mb-12 relative">
      <label class="text-base font-medium">이메일</label>
      <div class="mt-1 text-base text-black border-b border-gray-300 p-2">
        {{ store.ownerInfo.email ? store.ownerInfo.email : '-' }}
      </div>
    </div>

    <!-- <div class="mb-10 relative">
      <BaseTypography class="mb-2" weight="semibold">약관 동의</BaseTypography>

      <div class="flex items-center mb-3 cursor-pointer" @click="toggleAll">
        <span
          class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
          :class="allChecked ? 'bg-black text-white' : 'bg-gray-300 text-white'"
        >
          check
        </span>
        <span class="ml-2 text-sm">전체 동의합니다.</span>
      </div>

      <hr class="mb-3" />

      <ul class="space-y-1 text-sm text-gray-800">
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('terms')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.terms ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">이용약관에 동의 합니다. (필수)</span>
          </div>
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('terms')"
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
        </li>
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('privacy')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.privacy ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">개인정보 수집 및 이용에 동의합니다. (필수)</span>
          </div>
          <span
            class="material-symbols-outlined text-xs cursor-pointer"
            @click="openModal('terms')"
            style="font-size: 14px"
          >
            arrow_forward_ios
          </span>
        </li>
        <li class="flex items-center justify-between cursor-pointer" @click="toggle('age')">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-lg rounded-full w-5 h-5 flex items-center justify-center"
              :class="agreements.age ? 'bg-black text-white' : 'bg-gray-300 text-white'"
            >
              check
            </span>
            <span class="ml-2">만 14세 이상입니다. (필수)</span>
          </div>
        </li>
      </ul>

      <BaseTypography
        v-if="isPartiallyChecked"
        color="red-1"
        size="xs"
        class="absolute mt-2 left-0 top-full"
      >
        * 모든 약관에 동의해주세요.
      </BaseTypography>
    </div> -->

    <TermsAgreement
      v-model:agreements="agreements"
      :modalText="propertyModalText"
      :showModal="true"
      :errorOnPartial="true"
      title="약관 동의"
    />

    <div class="pb-12">
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleNext"
      >
        다음
      </CompletedButton>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useAuthStore } from '@/stores/authStore'
import { formatPhoneNumber } from '@/utils/format'
import { useToastStore } from '@/stores/toast'
import TermsAgreement from '@/components/auth/TermsAgreement.vue'

const toast = useToastStore()
const authStore = useAuthStore()
const store = usePropertyRegisterStore()

// v-model:agreements 바인딩용 프락시
const agreements = computed({
  get: () => store.ownerInfo.agreements,
  set: (val) => (store.ownerInfo.agreements = val),
})
// const agreements = store.ownerInfo.agreements

const propertyModalText = {
  terms: `제 1 조 (목적)
본 약관은 회원이 매물 등록 서비스를 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2 조 (매물 등록의 성립)
회원은 매물 등록 시 본 약관에 동의해야 하며, 회사는 내부 검수 절차를 거쳐 매물 등록 여부를 최종 승인합니다.

제 3 조 (서비스의 제공)
회사는 회원이 등록한 매물이 플랫폼을 통해 노출되도록 하며, 필요 시 매물 정보를 검토 및 수정 요청할 수 있습니다.

제 4 조 (회원의 의무)
회원은 사실과 다른 허위 정보를 등록해서는 안 되며, 타인의 권리를 침해하거나 불법적인 매물을 등록해서는 안 됩니다.

제 5 조 (매물 등록 취소 및 제한)
회원은 언제든 매물 등록을 취소할 수 있으며, 회사는 등록된 매물이 허위이거나 법령을 위반할 경우 사전 통지 없이 등록을 제한 또는 삭제할 수 있습니다.

제 6 조 (면책 조항)
회사는 회원이 제공한 매물 정보의 정확성 및 신뢰성에 대해 책임을 지지 않으며, 매물 거래 과정에서 발생하는 문제에 대해서도 책임을 지지 않습니다.
`,
  privacy: `1. 수집하는 항목
- 필수 항목: 이름, 연락처, 계좌정보, 매물 주소 및 세부 정보, 신분 확인 서류
- 선택 항목: 이메일, 참고 이미지 및 추가 설명 자료

2. 수집 목적
- 매물 등록 및 검수, 본인 확인, 거래 진행 및 정산 처리, 고객 문의 응대, 불법 등록 및 부정 이용 방지

3. 보유 및 이용 기간
- 매물 등록일로부터 등록 취소 또는 회원 탈퇴 후 5일까지 (관련 법령에 따라 별도 보관 의무가 있는 경우 해당 기간까지 보관)

4. 제3자 제공
- 매물 거래와 관련된 법적 요구 또는 금융 정산을 위해 필요한 경우에 한하여 관계 기관 및 제휴사에 제공될 수 있습니다.

5. 동의 거부 권리 안내
- 사용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 이 경우 매물 등록 서비스 이용이 제한될 수 있습니다.
`,
}

// 유효성: 모두 체크되었는가
const allChecked = computed(() => Object.values(agreements.value || {}).every(Boolean))
// const allChecked = computed(() => agreements.terms && agreements.privacy && agreements.age)

const isStepValid = computed(() => allChecked.value)

onMounted(async () => {
  try {
    if (!authStore.userInfo) {
      await authStore.loadUserInfo()
    }
    store.ownerInfo.name = authStore.userInfo.name
    store.ownerInfo.phone = authStore.userInfo.phone
    store.ownerInfo.email = authStore.userInfo.email
    store.ownerInfo.userId = authStore.userInfo.userId
  } catch {
    toast.error({
      title: '자동완성 실패',
      body: '자동완성에 실패했습니다. 로그인 상태를 확인해주세요.',
    })
  }
})

// const toggle = (key) => {
//   agreements[key] = !agreements[key]
// }
// const toggleAll = () => {
//   const next = !(agreements.terms && agreements.privacy && agreements.age)
//   agreements.terms = next
//   agreements.privacy = next
//   agreements.age = next
// }

// const isPartiallyChecked = computed(() => {
//   const count = [agreements.terms, agreements.privacy, agreements.age].filter(Boolean).length
//   return count > 0 && count < 3
// })

const handleNext = () => {
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
