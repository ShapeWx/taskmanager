<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-emerald-900">Priority Chart</h1>
      <p class="text-gray-600 mt-2">Visualize your tasks by priority and impact</p>
    </div>

    <!-- Priority Matrix (2x2) -->
    <div class="grid grid-cols-2 gap-4">
      <!-- High Impact, High Effort -->
      <PriorityMatrix
        title="Strategic Projects"
        subtitle="High Impact, High Effort"
        color="bg-red-50 border-red-300"
        tasks="18"
        icon="StarIcon"
      />
      <!-- High Impact, Low Effort -->
      <PriorityMatrix
        title="Quick Wins"
        subtitle="High Impact, Low Effort"
        color="bg-green-50 border-green-300"
        tasks="12"
        icon="LightBulbIcon"
      />
      <!-- Low Impact, High Effort -->
      <PriorityMatrix
        title="Time Fillers"
        subtitle="Low Impact, High Effort"
        color="bg-yellow-50 border-yellow-300"
        tasks="7"
        icon="ClockIcon"
      />
      <!-- Low Impact, Low Effort -->
      <PriorityMatrix
        title="Eliminate"
        subtitle="Low Impact, Low Effort"
        color="bg-blue-50 border-blue-300"
        tasks="3"
        icon="TrashIcon"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Priority Distribution -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Priority Distribution</h3>
        <div class="space-y-4">
          <PriorityBar label="Critical" percentage="15" color="bg-red-500" />
          <PriorityBar label="High" percentage="35" color="bg-yellow-500" />
          <PriorityBar label="Medium" percentage="35" color="bg-blue-500" />
          <PriorityBar label="Low" percentage="15" color="bg-green-500" />
        </div>
      </div>

      <!-- Top Priority Tasks -->
      <div class="lg:col-span-2 bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Top Priority Tasks</h3>
        <div class="space-y-3">
          <TopPriorityTask
            v-for="task in topPriorityTasks"
            :key="task.id"
            :task="task"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PriorityMatrix from '../components/PriorityMatrix.vue'
import PriorityBar from '../components/PriorityBar.vue'
import TopPriorityTask from '../components/TopPriorityTask.vue'

const topPriorityTasks = ref([
  { id: 1, title: 'Critical Bug Fix - Payment System', priority: 'critical', dueDate: '2026-05-08', assignee: 'John Doe' },
  { id: 2, title: 'Security Audit Preparation', priority: 'critical', dueDate: '2026-05-09', assignee: 'Sarah Williams' },
  { id: 3, title: 'API Performance Optimization', priority: 'high', dueDate: '2026-05-10', assignee: 'Mike Johnson' }
])
</script>

<style scoped></style>


