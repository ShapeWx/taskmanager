<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-emerald-900">Analytics & Reporting</h1>
      <p class="text-gray-600 mt-2">Track team performance and project metrics</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsCard
        title="Completion Rate"
        value="87%"
        change="+5% from last week"
        icon="CheckCircleIcon"
        color="text-green-700"
      />
      <AnalyticsCard
        title="On-Time Delivery"
        value="92%"
        change="+2% from last week"
        icon="CalendarIcon"
        color="text-blue-700"
      />
      <AnalyticsCard
        title="Avg Completion Time"
        value="3.2d"
        change="-0.5d vs last week"
        icon="ClockIcon"
        color="text-emerald-700"
      />
      <AnalyticsCard
        title="Team Velocity"
        value="45 pts"
        change="+8 pts from sprint 1"
        icon="TrendingUpIcon"
        color="text-purple-700"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Task Completion Trend -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Task Completion Trend</h3>
        <div class="space-y-3">
          <TrendBar day="Mon" percentage="65" />
          <TrendBar day="Tue" percentage="72" />
          <TrendBar day="Wed" percentage="78" />
          <TrendBar day="Thu" percentage="85" />
          <TrendBar day="Fri" percentage="87" />
        </div>
      </div>

      <!-- Team Performance -->
      <div class="bg-white rounded p-6 shadow border border-gray-200">
        <h3 class="text-lg font-bold text-emerald-900 mb-4">Team Performance</h3>
        <div class="space-y-3">
          <TeamMemberPerformance
            v-for="member in teamPerformance"
            :key="member.id"
            :member="member"
          />
        </div>
      </div>
    </div>

    <!-- Burn-down Chart -->
    <div class="bg-white rounded p-6 shadow border border-gray-200">
      <h3 class="text-lg font-bold text-emerald-900 mb-4">Sprint Burn-down Chart</h3>
      <div class="h-64 flex items-end justify-around">
        <BurndownBar
          v-for="day in burndownData"
          :key="day.day"
          :day="day.day"
          :remaining="day.remaining"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnalyticsCard from '../components/AnalyticsCard.vue'
import TrendBar from '../components/TrendBar.vue'
import TeamMemberPerformance from '../components/TeamMemberPerformance.vue'
import BurndownBar from '../components/BurndownBar.vue'

const teamPerformance = ref([
  { id: 1, name: 'John Doe', tasksCompleted: 18, efficiency: 94 },
  { id: 2, name: 'Jane Smith', tasksCompleted: 15, efficiency: 88 },
  { id: 3, name: 'Mike Johnson', tasksCompleted: 21, efficiency: 96 },
  { id: 4, name: 'Sarah Williams', tasksCompleted: 12, efficiency: 85 }
])

const burndownData = ref([
  { day: 'Day 1', remaining: 100 },
  { day: 'Day 2', remaining: 85 },
  { day: 'Day 3', remaining: 70 },
  { day: 'Day 4', remaining: 55 },
  { day: 'Day 5', remaining: 40 },
  { day: 'Day 6', remaining: 25 },
  { day: 'Day 7', remaining: 10 }
])
</script>

<style scoped></style>


