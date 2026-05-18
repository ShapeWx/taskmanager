<template>
  <div class="bg-white rounded p-6 shadow border border-emerald-200 hover:shadow-md transition-all text-center">
    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mx-auto mb-3 flex items-center justify-center text-white font-bold">
      {{ member.avatar }}
    </div>
    <h4 class="font-semibold text-gray-800">{{ member.name }}</h4>
    <p class="text-sm text-gray-600 mt-1">{{ member.role }}</p>
    <div class="flex justify-center space-x-2 mt-3">
      <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(member.status)]">
        {{ member.status }}
      </span>
    </div>
    <div class="mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-700">
        <span class="font-bold text-emerald-700">{{ member.tasksCount }}</span> active tasks
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  member: Object
})

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-700',
    away: 'bg-yellow-100 text-yellow-700',
    offline: 'bg-gray-100 text-gray-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped></style>


