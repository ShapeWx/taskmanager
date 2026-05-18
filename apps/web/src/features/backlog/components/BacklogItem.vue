<template>
  <div class="bg-white rounded-lg p-4 shadow border border-gray-200 border-l-4 hover:shadow-md transition-all group"
    :class="priorityBorderColor"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-semibold text-gray-800">{{ task.title }}</h4>
          <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', priorityBadge]">
            {{ task.priority?.toUpperCase() }}
          </span>
          <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', statusBadge]">
            {{ statusLabel }}
          </span>
          <span v-if="isOverdue" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            OVERDUE
          </span>
        </div>
        <p v-if="task.description" class="text-sm text-gray-500 mt-1 line-clamp-2">{{ task.description }}</p>
        <div class="flex items-center gap-4 mt-2.5 flex-wrap">
          <span v-if="task.dueDate" class="text-xs text-gray-500 flex items-center gap-1">
            <CalendarIcon class="w-3.5 h-3.5" />
            {{ formatDate(task.dueDate) }}
          </span>
          <div v-if="task.assignees?.length" class="flex -space-x-1.5">
            <div
              v-for="assignee in task.assignees.slice(0, 3)"
              :key="assignee"
              class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-xs text-white flex items-center justify-center font-bold"
              :title="assignee"
            >
              {{ assignee[0] }}
            </div>
            <div
              v-if="task.assignees.length > 3"
              class="w-6 h-6 rounded-full bg-gray-400 border-2 border-white text-xs text-white flex items-center justify-center font-bold"
            >
              +{{ task.assignees.length - 3 }}
            </div>
          </div>
          <div v-if="task.tags?.length" class="flex gap-1 flex-wrap">
            <span
              v-for="tag in task.tags.slice(0, 3)"
              :key="tag"
              class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <button
        @click.stop="$emit('delete', task)"
        class="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
        title="Delete task"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CalendarIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ task: Object })
defineEmits(['delete'])

const today = new Date().toISOString().split('T')[0]

const isOverdue = computed(() =>
  props.task.status !== 'done' && props.task.dueDate && props.task.dueDate < today
)

const priorityBorderColor = computed(() => ({
  high: 'border-l-red-400',
  medium: 'border-l-yellow-400',
  low: 'border-l-blue-400'
}[props.task.priority] ?? 'border-l-gray-300'))

const priorityBadge = computed(() => ({
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700'
}[props.task.priority] ?? 'bg-gray-100 text-gray-700'))

const statusBadge = computed(() => ({
  todo: 'bg-blue-100 text-blue-700',
  doing: 'bg-amber-100 text-amber-700',
  done: 'bg-green-100 text-green-700',
  backlog: 'bg-gray-100 text-gray-600'
}[props.task.status] ?? 'bg-gray-100 text-gray-700'))

const statusLabel = computed(() => ({
  todo: 'To Do',
  doing: 'In Progress',
  done: 'Done',
  backlog: 'Backlog'
}[props.task.status] ?? props.task.status))

const formatDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
