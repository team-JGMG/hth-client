<script setup>
import { computed } from 'vue'

const API_URI = 'https://api.example.com' // 실제 API 도메인으로 교체

const props = defineProps({
  type: {
    type: String, // 'kakao' | 'naver' | 'google'
    required: true,
  },
})

const socialTheme = {
  kakao: {
    label: '카카오',
    background: 'bg-[#FEE500]',
    textColor: 'text-black',
  },
  naver: {
    label: '네이버',
    background: 'bg-[#03C75A]',
    textColor: 'text-white',
  },
  google: {
    label: 'Google',
    background: 'border border-gray-200',
    textColor: 'text-black',
  },
}

const theme = computed(() => socialTheme[props.type])

const login = () => {
  if (props.type === 'kakao') {
    const url = `${API_URI}/oauth2/authorization/kakao`
    window.location.href = url
  } else {
    alert(`${theme.value.label} 로그인은 현재 지원하지 않습니다.`)
  }
}
const socialIcons = {
  kakao: new URL('@/assets/images/kakao.png', import.meta.url).href,
  naver: new URL('@/assets/images/naver.png', import.meta.url).href, // 실제로는 다른 이미지로 교체
  google: new URL('@/assets/images/google.png', import.meta.url).href, // 실제로는 다른 이미지로 교체
}

const imageSrc = computed(() => socialIcons[props.type])
const buttonText = computed(() => `${theme.value.label} 로그인`)
</script>

<template>
  <button
    :class="[
      'relative flex justify-center items-center w-full h-[56px] rounded-lg',
      theme.background,
    ]"
    @click="login"
    type="button"
    :data-social="props.type"
  >
    <div class="absolute left-4 top-4 w-[24px] h-[24px]">
      <img :src="imageSrc" alt="소셜 로고" class="object-contain w-full h-full" />
    </div>
    <span :class="['text-lg font-medium', theme.textColor]">
      {{ buttonText }}
    </span>
  </button>
</template>
