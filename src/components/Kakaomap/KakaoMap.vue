<template>
  <div class="w-full max-w-full overflow-hidden">
    <KakaoMap
      :lat="coordinate.lat"
      :lng="coordinate.lng"
      :draggable="true"
      class="w-full h-[300px]"
    >
      <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng" />
    </KakaoMap>
  </div>
</template>

<script setup>
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'

const coordinate = {
  lat: 33.450701,
  lng: 126.570667,
}
</script>
