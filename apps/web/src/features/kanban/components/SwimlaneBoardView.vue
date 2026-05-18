<template>
  <div class="bg-white rounded shadow border border-gray-200 overflow-x-auto">
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Swimlane View by Team Member</h3>
      
      <!-- Column Headers -->
      <div class="flex gap-6 pb-4 border-b border-gray-200 mb-4">
        <div class="w-48 flex-shrink-0"></div>
        <div
          v-for="category in categories"
          :key="category.id"
          class="w-80 flex-shrink-0 font-bold text-gray-800"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- Swimlanes -->
      <div class="space-y-4">
        <div v-for="member in uniqueMembers" :key="member" class="flex gap-6">
          <!-- Member Name -->
          <div class="w-48 flex-shrink-0">
            <div class="font-bold text-gray-800 p-2 bg-emerald-50 rounded">
              {{ member }}
            </div>
          </div>

          <!-- Tasks by Category -->
          <div
            v-for="category in categories"
            :key="`${member}-${category.id}`"
            class="w-80 flex-shrink-0 min-h-32 p-3 border border-dashed border-gray-300 rounded hover:border-emerald-600 transition-colors"
            @dragover="dragOverCell = `${member}-${category.id}`"
            @dragleave="dragOverCell = null"
            @drop="dropTaskInCell($event, member, category.id)"
            :class="dragOverCell === `${member}-${category.id}` ? 'ring-2 ring-emerald-500 border-solid' : ''"
          >
            <div class="space-y-2">
              <div
                v-for="task in getTasksByMemberAndCategory(member, category.id)"
                :key="task.id"
                draggable="true"
                @dragstart="draggedTask = task"
                @dragend="draggedTask = null"
                class="p-2 bg-gradient-to-br from-white to-emerald-50 rounded border-l-2 border-emerald-600 cursor-move hover:shadow-md transition-all text-sm"
              >
                <p class="font-semibold text-gray-800">{{ task.title }}</p>
                <p class="text-xs text-gray-600 truncate">{{ task.description }}</p>
                <div class="flex items-center justify-between mt-1">
                  <span :class="['text-xs font-bold px-2 py-0.5 rounded', getPriorityClass(task.priority)]">
                    {{ task.priority }}
                  </span>
                  <span class="text-xs text-gray-500">{{ formatDate(task.dueDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const props = defineProps({
  tasks: Array,
  categories: Array
})

const emit = defineEmits(['drop-task'])

const taskStore = useTaskStore()
const draggedTask = ref(null)
const dragOverCell = ref(null)

const uniqueMembers = computed(() => {
  const members = new Set()
  props.tasks.forEach(task => {
    if (task.assignees) {
      task.assignees.forEach(a => members.add(a))
    }
  })
  return Array.from(members).sort()
})

const getTasksByMemberAndCategory = (member, categoryId) => {
  return props.tasks.filter(task =>
    task.status === categoryId && task.assignees?.includes(member)
  )
}

const dropTaskInCell = (event, member, categoryId) => {
  event.preventDefault()
  if (draggedTask.value) {
    // Ensure member is assigned
    if (!draggedTask.value.assignees.includes(member)) {
      draggedTask.value.assignees = [...draggedTask.value.assignees, member]
    }
    taskStore.updateTaskStatus(draggedTask.value.id, categoryId)
    draggedTask.value = null
    dragOverCell.value = null
  }
}

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700'
  }
  return classes[priority] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped></style>


