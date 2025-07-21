<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code
  const provider = route.query.provider || 'kakao' // 경로 또는 상태값으로 전달받을 수도 있음

  if (code) {
    try {
      const { data } = await axios.post('https://api.example.com/auth/social/login', {
        provider,
        code,
      })

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      // 필요시 userInfo 저장 등

      router.push('/') // 로그인 성공 시 홈으로 이동
    } catch (e) {
      console.error('로그인 실패', e)
      router.push('/login?error=1')
    }
  }
})
</script>
