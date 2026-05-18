<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <CheckCircleIcon class="w-10 h-10 text-emerald-700" />
          <h1 class="text-4xl font-bold text-emerald-900">Task Master</h1>
        </div>
        <p class="text-gray-600">Reset your password</p>
      </div>

      <!-- Password Reset Form -->
      <div class="bg-white rounded shadow-lg p-8 space-y-6 border border-gray-200">
        <div v-if="step === 'email'" class="space-y-6">
          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded">
            <p class="text-red-700 text-sm font-semibold">{{ errorMessage }}</p>
          </div>

          <p class="text-gray-600 text-sm">Enter your email address and we'll send you instructions to reset your password.</p>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <button
            @click="handleSendReset"
            class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded transition-all duration-200"
          >
            Send Reset Link
          </button>
        </div>

        <div v-if="step === 'reset'" class="space-y-6">
          <div class="p-4 bg-green-50 border border-green-200 rounded">
            <p class="text-green-700 text-sm font-semibold">Check your email for reset instructions!</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
            <input
              v-model="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
            />
          </div>

          <button
            @click="handleResetPassword"
            class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded transition-all duration-200"
          >
            Reset Password
          </button>
        </div>

        <p class="text-center text-gray-600">
          Remember your password?
          <router-link to="/auth/login" class="text-emerald-700 hover:text-emerald-900 font-semibold">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const email = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const errorMessage = ref('')
const step = ref('email')

const handleSendReset = () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email'
    return
  }
  step.value = 'reset'
}

const handleResetPassword = () => {
  if (!newPassword.value || !confirmNewPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (newPassword.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }

  // Simulate password reset
  setTimeout(() => {
    router.push('/auth/login')
  }, 1500)
}
</script>

<style scoped></style>


