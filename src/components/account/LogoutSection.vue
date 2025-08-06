<!-- components/account/LogoutSection.vue -->
<template>
  <div class="mt-6">
    <LogoutButton />
    <DeleteAccountButton />
    <div class="py-8"></div>
  </div>
</template>

<script setup>
import LogoutButton from './LogoutButton.vue'
import DeleteAccountButton from './DeleteAccountButton.vue'
</script>
