<template>
  <!-- <MainLayout ref="null"> -->
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-emerald-900">My Profile</h1>
        <p class="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="bg-white rounded p-6 shadow border border-gray-200">
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {{ getUserInitials() }}
            </div>
            <h2 class="text-2xl font-bold text-gray-800">{{ authStore.user?.name }}</h2>
            <p class="text-gray-600 mt-1">{{ authStore.user?.email }}</p>
            <span class="mt-3 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              {{ getRoleName(authStore.user?.role) }}
            </span>
          </div>
        </div>

        <!-- Account Information -->
        <div class="lg:col-span-2 bg-white rounded p-6 shadow border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                v-model="editedUser.name"
                type="text"
                class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                v-model="editedUser.email"
                type="email"
                class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div class="pt-4">
              <button
                @click="saveProfile"
                class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Card -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Your Permissions</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="perm in getPermissions()"
            :key="perm"
            class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold"
          >
            {{ formatPermission(perm) }}
          </span>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Change Password</h3>
        <div v-if="passwordMessage" :class="['p-4 rounded mb-4', passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200']">
          <p :class="passwordMessage.type === 'success' ? 'text-green-700' : 'text-red-700'" class="text-sm font-semibold">
            {{ passwordMessage.text }}
          </p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              v-model="passwordForm.current"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              v-model="passwordForm.new"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div class="pt-4">
            <button
              @click="changePassword"
              class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold transition-all duration-200"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  <!-- </MainLayout> -->
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/features/shared/components/MainLayout.vue'

const authStore = useAuthStore()

const editedUser = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const passwordMessage = ref(null)

const getUserInitials = () => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getRoleName = (roleKey) => {
  return authStore.roles[roleKey]?.name || 'Unknown'
}

const getPermissions = () => {
  if (!authStore.user?.role) return []
  return authStore.roles[authStore.user.role]?.permissions || []
}

const formatPermission = (perm) => {
  return perm
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const saveProfile = () => {
  if (authStore.user) {
    authStore.user.name = editedUser.value.name
    authStore.user.email = editedUser.value.email
    localStorage.setItem('taskmaster-user', JSON.stringify(authStore.user))
  }
}

const changePassword = () => {
  passwordMessage.value = null
  
  if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
    passwordMessage.value = { type: 'error', text: 'Please fill in all password fields' }
    return
  }

  if (passwordForm.new !== passwordForm.confirm) {
    passwordMessage.value = { type: 'error', text: 'New passwords do not match' }
    return
  }

  if (passwordForm.new.length < 8) {
    passwordMessage.value = { type: 'error', text: 'Password must be at least 8 characters' }
    return
  }

  // Update password in users list
  const currentUser = authStore.users.find(u => u.id === authStore.user?.id)
  if (currentUser && currentUser.password === passwordForm.current) {
    currentUser.password = passwordForm.new
    passwordMessage.value = { type: 'success', text: 'Password changed successfully!' }
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } else {
    passwordMessage.value = { type: 'error', text: 'Current password is incorrect' }
  }
}
</script>

<style scoped></style>


