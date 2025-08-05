<template>
  <div ref="mapContainer" class="w-full h-[300px] rounded-lg z-0"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)

const loadMap = () => {
  const script = document.createElement('script')
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`
  script.onload = () => {
    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
        level: 3,
      }
      new window.kakao.maps.Map(mapContainer.value, options)
    })
  }
  document.head.appendChild(script)
}

onMounted(() => {
  loadMap()
})
</script>
