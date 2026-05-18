<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-emerald-900">Team Management</h1>
        <p class="text-gray-600 mt-2">Manage team members, roles, and permissions</p>
      </div>
      <Button label="Add Member" icon="UserPlusIcon" variant="primary" />
    </div>

    <!-- Team Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TeamMemberCard
        v-for="member in teamMembers"
        :key="member.id"
        :member="member"
      />
    </div>

    <!-- Team Statistics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Workload Distribution -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Workload Distribution</h3>
        <div class="space-y-3">
          <WorkloadBar
            v-for="member in workloadData"
            :key="member.id"
            :name="member.name"
            :tasks="member.tasks"
          />
        </div>
      </div>

      <!-- Team Roles -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Team Roles</h3>
        <div class="space-y-2">
          <RoleTag v-for="role in teamRoles" :key="role.id" :role="role" />
        </div>
      </div>

      <!-- Team Availability -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Availability</h3>
        <div class="space-y-3">
          <AvailabilityStatus
            v-for="member in availabilityData"
            :key="member.id"
            :member="member"
          />
        </div>
      </div>
    </div>

    <!-- Permissions & Access -->
    <div class="bg-white rounded p-6 shadow border border-gray-200">
      <h3 class="text-lg font-bold text-emerald-900 mb-4">Roles & Permissions</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-emerald-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Members</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Permissions</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in rolePermissions" :key="role.id" class="border-b border-gray-100 hover:bg-emerald-50">
              <td class="py-3 px-4 font-medium text-gray-800">{{ role.name }}</td>
              <td class="py-3 px-4 text-gray-600">{{ role.members }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ role.permissions.join(', ') }}</td>
              <td class="py-3 px-4">
                <button class="text-emerald-600 hover:text-emerald-800 font-semibold text-sm">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/features/shared/components/Button.vue'
import TeamMemberCard from '../components/TeamMemberCard.vue'
import WorkloadBar from '../components/WorkloadBar.vue'
import RoleTag from '../components/RoleTag.vue'
import AvailabilityStatus from '../components/AvailabilityStatus.vue'

const teamMembers = ref([
  { id: 1, name: 'John Doe', role: 'Senior Developer', status: 'active', tasksCount: 18, avatar: 'JD' },
  { id: 2, name: 'Jane Smith', role: 'UI/UX Designer', status: 'active', tasksCount: 15, avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', role: 'QA Engineer', status: 'active', tasksCount: 21, avatar: 'MJ' },
  { id: 4, name: 'Sarah Williams', role: 'Product Manager', status: 'away', tasksCount: 12, avatar: 'SW' }
])

const workloadData = ref([
  { id: 1, name: 'John Doe', tasks: 18 },
  { id: 2, name: 'Jane Smith', tasks: 15 },
  { id: 3, name: 'Mike Johnson', tasks: 21 },
  { id: 4, name: 'Sarah Williams', tasks: 12 }
])

const teamRoles = ref([
  { id: 1, name: 'Admin', count: 1, color: 'bg-red-100 text-red-700' },
  { id: 2, name: 'Project Manager', count: 1, color: 'bg-blue-100 text-blue-700' },
  { id: 3, name: 'Developer', count: 1, color: 'bg-emerald-100 text-emerald-700' },
  { id: 4, name: 'Designer', count: 1, color: 'bg-purple-100 text-purple-700' }
])

const availabilityData = ref([
  { id: 1, name: 'John Doe', status: 'active', statusColor: 'bg-green-500' },
  { id: 2, name: 'Jane Smith', status: 'active', statusColor: 'bg-green-500' },
  { id: 3, name: 'Mike Johnson', status: 'in-meeting', statusColor: 'bg-yellow-500' },
  { id: 4, name: 'Sarah Williams', status: 'away', statusColor: 'bg-gray-500' }
])

const rolePermissions = ref([
  { id: 1, name: 'Admin', members: 1, permissions: ['Full Access', 'Manage Users', 'View Reports'] },
  { id: 2, name: 'Project Manager', members: 1, permissions: ['Create Tasks', 'Manage Team', 'View Reports'] },
  { id: 3, name: 'Developer', members: 1, permissions: ['Create Tasks', 'Update Tasks', 'View Tasks'] },
  { id: 4, name: 'Designer', members: 1, permissions: ['Create Tasks', 'Update Tasks', 'Comment'] }
])
</script>

<style scoped></style>


