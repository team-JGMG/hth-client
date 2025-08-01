<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="mb-6" size="xl" weight="bold">매물 정보를 입력해주세요.</BaseTypography>

    <!-- 매물명 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.title"
        label="매물명"
        placeholder="매물명을 입력해주세요."
        @focus="touched.title = true"
      />
      <BaseTypography
        v-if="touched.title && !titleValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 주소 -->
    <div class="mb-12 relative">
      <div class="flex items-center gap-2">
        <InputField
          v-model="store.propertyBasic.zipcode"
          label="매물 주소 조회"
          placeholder="우편번호"
          class="flex-1"
          readonly
        />
        <BaseButton class="h-[38px] bg-gray-600 hover:bg-gray-600 text-sm" @click="searchAddress">
          주소 검색
        </BaseButton>
      </div>
      <InputField
        v-model="store.propertyBasic.address"
        placeholder="주소를 입력해주세요."
        class="mt-1 mb-7"
        readonly
        @focus="touched.address = true"
      />
      <InputField
        v-model="store.propertyBasic.detailAddress"
        placeholder="상세주소를 입력해주세요."
        class="mt-1"
        @focus="touched.detailAddress = true"
      />
      <BaseTypography
        v-if="(touched.address || touched.detailAddress) && (!addressValid || !detailAddressValid)"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 주소 및 상세주소를 입력해주세요.
      </BaseTypography>
    </div>

    <!-- 매물 크기 -->
    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBasic.size"
            label="매물 크기"
            placeholder="면적을 입력해주세요."
            @focus="touched.size = true"
          />
        </div>
        <span class="text-base text-black translate-y-2">㎡</span>
      </div>
      <BaseTypography
        v-if="touched.size && !sizeValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ store.propertyBasic.size.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
      </BaseTypography>
    </div>

    <!-- 희망 매매가 -->
    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBasic.price"
            label="희망 매매가"
            placeholder="금액을 입력해주세요."
            @focus="touched.price = true"
          />
        </div>
        <span class="text-base text-black translate-y-2">원</span>
      </div>
      <BaseTypography
        v-if="touched.price && !priceValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ store.propertyBasic.price.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
      </BaseTypography>
    </div>

    <!-- 공고 기간 -->
    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBasic.period"
            label="희망 공고 기간"
            type="date"
            placeholder="개월 수를 숫자로 입력해주세요."
            @focus="touched.period = true"
          />
        </div>
        <span class="text-base text-black translate-y-1">개월</span>
      </div>
      <BaseTypography
        v-if="touched.period && !periodValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ store.propertyBasic.period.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <div class="pb-28">
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
import { ref, computed } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

const store = usePropertyRegisterStore()

const touched = ref({
  title: false,
  address: false,
  detailAddress: false,
  size: false,
  price: false,
  period: false,
})

const searchAddress = () => {
  new daum.Postcode({
    oncomplete: function (data) {
      // 사용자가 선택한 주소를 구성
      let fullAddr = data.address
      let extraAddr = ''

      if (data.addressType === 'R') {
        if (data.bname !== '') extraAddr += data.bname
        if (data.buildingName !== '') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
        }
        fullAddr += extraAddr !== '' ? ' (' + extraAddr + ')' : ''
      }

      // 입력 필드에 데이터 바인딩
      store.propertyBasic.zipcode = data.zonecode
      store.propertyBasic.address = fullAddr

      // 상세 주소는 사용자가 직접 입력
      touched.value.address = true
    },
  }).open()
}

// 유효성 검사
const titleValid = computed(() => store.propertyBasic.title.trim() !== '')
const addressValid = computed(() => store.propertyBasic.address.trim() !== '')
const detailAddressValid = computed(() => store.propertyBasic.detailAddress.trim() !== '')
const sizeValid = computed(() => /^[0-9]+$/.test(store.propertyBasic.size.trim()))
const priceValid = computed(() => /^[0-9]+$/.test(store.propertyBasic.price.trim()))
const periodValid = computed(() => /^[0-9]+$/.test(store.propertyBasic.period.trim()))

const isStepValid = computed(
  () =>
    titleValid.value &&
    addressValid.value &&
    detailAddressValid.value &&
    sizeValid.value &&
    priceValid.value &&
    periodValid.value,
)

const handleNext = () => {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true))
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
