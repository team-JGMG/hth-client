<template>
  <div ref="mapContainer" class="w-full h-[300px] rounded-lg z-0"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)

const loadMap = () => {
  const latitude = 37.5485601
  const longitude = 127.074738

  const script = document.createElement('script')
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`
  script.onload = () => {
    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(latitude, longitude)
      const map = new window.kakao.maps.Map(mapContainer.value, {
        center,
        level: 3,
      })

      const markerImageSrc = 'https://i.ibb.co/xK8ZD34f/marker.png'
      const markerSize = new window.kakao.maps.Size(40, 40)
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerSize)

      new window.kakao.maps.Marker({
        map,
        position: center,
        image: markerImage,
      })
    })
  }

  document.head.appendChild(script)
}

onMounted(() => {
  loadMap()
})
</script>
