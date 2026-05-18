<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useThemeStore } from './stores/themes/themeStore'
import { useAuthStore } from './stores/authStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()

// Initialize IndexedDB
const DBOpenRequest = window.indexedDB.open('task-master')
console.log(DBOpenRequest)

// Initialize theme and auth on app mount
onMounted(() => {
  themeStore.initializeTheme()
  authStore.initializeAuth()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
:root {
  @apply font-serif;
}
</style>
