<style scoped>
.nav-bar {
  padding: 0.75rem 2rem;
  position: fixed;
  max-width: 768px;
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

<template>
  <nav class="d-flex justify-content-between nav-bar w-100 bg-white">
    <!-- <RouterLink
            v-for="menu in MENUS"
            :key="menu.name"
            :to="{ name: menu.name }"
            class="text-decoration-none d-flex flex-column align-items-center gap-1 bg-white border-0"
            :class="{
                'text-black': route.name === menu.name,
                'text-gray': route.name !== menu.name,
            }"
        >
            <i class="fa-solid" :class="menu.icon"></i>
            <span class="fs-xs">{{ menu.label }}</span>
        </RouterLink> -->
    gkgk
  </nav>
</template>

<script setup>
// import { MENUS } from '@/common/constants'
// import { useRoute } from 'vue-router'

// const route = useRoute()
</script>
