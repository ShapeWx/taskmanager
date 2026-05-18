<template>
  <div class="p-4 border-l-2 border-emerald-600 bg-emerald-50 rounded hover:shadow-md transition-all">
    <div class="flex items-start justify-between">
      <div>
        <p class="font-semibold text-gray-800">{{ task.title }}</p>
        <div class="flex items-center space-x-2 mt-2">
          <span :class="['text-xs font-bold px-2 py-1 rounded', getPriorityClass(task.priority)]">
            {{ task.priority.toUpperCase() }}
          </span>
          <span class="text-xs text-gray-600">Due: {{ formatDate(task.dueDate) }}</span>
          <span class="text-xs text-gray-600">Assigned to: {{ task.assignee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: Object
})

const getPriorityClass = (priority) => {
  const classes = {
    critical: 'bg-red-200 text-red-800',
    high: 'bg-yellow-200 text-yellow-800',
    medium: 'bg-blue-200 text-blue-800',
    low: 'bg-green-200 text-green-800'
  }
  return classes[priority] || 'bg-gray-200 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped></style>


