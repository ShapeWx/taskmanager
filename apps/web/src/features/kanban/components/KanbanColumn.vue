<template>
  <div class="bg-white rounded p-4 shadow border-t-2 border-emerald-600">
    <h3 class="font-bold text-lg mb-4 text-gray-800">{{ column.name }}</h3>
    <div class="space-y-3 min-h-96">
      <div
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        class="p-3 bg-gradient-to-br from-white to-emerald-50 rounded border-l-2 border-emerald-600 hover:shadow-md transition-all cursor-move"
      >
        <p class="font-semibold text-sm text-gray-800">{{ task.title }}</p>
        <div class="flex items-center justify-between mt-3">
          <div class="flex space-x-1">
            <Tag
              v-for="tag in task.tags"
              :key="tag"
              :label="tag"
              color="info"
            />
          </div>
          <span :class="['text-xs font-bold px-2 py-1 rounded', getPriorityClass(task.priority)]">
            {{ task.priority.toUpperCase() }}
          </span>
        </div>
        <div v-if="task.assignees" class="flex -space-x-2 mt-3">
          <div
            v-for="assignee in task.assignees"
            :key="assignee"
            class="w-6 h-6 rounded-full bg-emerald-600 border border-white text-xs text-white flex items-center justify-center font-bold"
            :title="assignee"
          >
            {{ assignee[0] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tag from '@/features/shared/components/Tag.vue'

defineProps({
  column: Object,
  tasks: Array
})

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700'
  }
  return classes[priority] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped></style>


