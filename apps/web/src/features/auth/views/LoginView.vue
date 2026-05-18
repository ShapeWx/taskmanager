<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <CheckCircleIcon class="w-10 h-10 text-emerald-700" />
          <h1 class="text-4xl font-bold text-emerald-900">Task Master</h1>
        </div>
        <p class="text-gray-600">Welcome back! Sign in to continue.</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded shadow-lg p-8 space-y-6 border border-gray-200">
        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-700 text-sm font-semibold">{{ errorMessage }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="rounded" />
            <span class="text-sm text-gray-600">Remember me</span>
          </label>
          <router-link to="/auth/forgot-password" class="text-sm text-emerald-700 hover:text-emerald-900 font-semibold">
            Forgot password?
          </router-link>
        </div>

        <button
          @click="handleLogin"
          class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded transition-all duration-200 transform hover:scale-105"
        >
          Sign In
        </button>

        <p class="text-center text-gray-600">
          Don't have an account?
          <router-link to="/auth/register" class="text-emerald-700 hover:text-emerald-900 font-semibold">
            Sign up
          </router-link>
        </p>

        <!-- Demo Credentials -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-600 mb-2 font-semibold">Demo Credentials:</p>
          <div class="text-xs text-gray-600 space-y-1">
            <p><span class="font-semibold">Admin:</span> admin@taskmaster.com / admin123</p>
            <p><span class="font-semibold">Manager:</span> manager@taskmaster.com / manager123</p>
            <p><span class="font-semibold">User:</span> user@taskmaster.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  const result = authStore.login(email.value, password.value)
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped></style>


