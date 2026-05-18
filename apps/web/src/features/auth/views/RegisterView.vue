<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <CheckCircleIcon class="w-10 h-10 text-emerald-700" />
          <h1 class="text-4xl font-bold text-emerald-900">Task Master</h1>
        </div>
        <p class="text-gray-600">Create your account to get started.</p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded shadow-lg p-8 space-y-6 border border-gray-200">
        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded">
          <p class="text-red-700 text-sm font-semibold">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded">
          <p class="text-green-700 text-sm font-semibold">{{ successMessage }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            v-model="fullName"
            type="text"
            placeholder="John Doe"
            class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
          />
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
          <p class="text-xs text-gray-600 mt-1">At least 8 characters</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600"
          />
        </div>

        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="agreeToTerms" class="rounded" />
          <span class="text-sm text-gray-600">
            I agree to the
            <a href="#" class="text-emerald-700 hover:text-emerald-900 font-semibold">Terms of Service</a>
            and
            <a href="#" class="text-emerald-700 hover:text-emerald-900 font-semibold">Privacy Policy</a>
          </span>
        </label>

        <button
          @click="handleRegister"
          class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded transition-all duration-200 transform hover:scale-105"
        >
          Create Account
        </button>

        <p class="text-center text-gray-600">
          Already have an account?
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
import { useAuthStore } from '@/stores/authStore'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = () => {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }

  if (!agreeToTerms.value) {
    errorMessage.value = 'You must agree to the terms and conditions'
    return
  }

  const result = authStore.register(email.value, password.value, fullName.value)
  if (result.success) {
    successMessage.value = 'Account created successfully! Redirecting...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped></style>


