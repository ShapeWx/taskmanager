<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-emerald-900">Authorization & Permissions</h1>
      <p class="text-gray-600 mt-2">Manage user roles and permissions</p>
    </div>

    <!-- User Management -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Users</h3>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div v-for="u in authStore.users" :key="u.id" class="p-4 border border-gray-200 rounded flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800">{{ u.name }}</p>
              <p class="text-xs text-gray-600">{{ u.email }}</p>
              <p class="text-xs text-emerald-700 font-bold mt-1">{{ getRoleName(u.role) }}</p>
            </div>
            <button
              v-if="authStore.hasRole('admin')"
              @click="selectedUser = u; showRoleModal = true"
              class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded font-semibold text-sm hover:bg-emerald-200"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Role Definitions -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Roles & Permissions</h3>
        <div class="space-y-4">
          <div v-for="(role, roleKey) in authStore.roles" :key="roleKey" class="border border-gray-200 rounded p-3">
            <p class="font-semibold text-gray-800">{{ role.name }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="perm in role.permissions"
                :key="perm"
                class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-semibold"
              >
                {{ formatPermission(perm) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal && selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card class="p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Change User Role</h2>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-2">Current Role: <span class="text-emerald-700">{{ getRoleName(selectedUser.role) }}</span></p>
            <label class="block text-sm font-semibold text-gray-700 mb-2">New Role</label>
            <select
              v-model="newRole"
              class="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option v-for="(role, key) in authStore.roles" :key="key" :value="key">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div v-if="newRole" class="p-3 bg-emerald-50 rounded">
            <p class="text-xs font-semibold text-gray-700 mb-2">This role has permissions:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="perm in authStore.roles[newRole].permissions"
                :key="perm"
                class="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded font-semibold"
              >
                {{ formatPermission(perm) }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <Button label="Update" variant="primary" @click="updateUserRole" style="flex: 1" />
            <Button label="Cancel" variant="secondary" @click="showRoleModal = false" style="flex: 1" />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/features/shared/components/Button.vue'
import Card from '@/features/shared/components/Card.vue'

const authStore = useAuthStore()

const showRoleModal = ref(false)
const selectedUser = ref(null)
const newRole = ref('')

const getRoleName = (roleKey) => {
  return authStore.roles[roleKey]?.name || 'Unknown'
}

const formatPermission = (perm) => {
  return perm
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const updateUserRole = () => {
  if (selectedUser.value && newRole.value) {
    authStore.updateUserRole(selectedUser.value.id, newRole.value)
    selectedUser.value.role = newRole.value
    showRoleModal.value = false
    selectedUser.value = null
    newRole.value = ''
  }
}
</script>

<style scoped></style>


