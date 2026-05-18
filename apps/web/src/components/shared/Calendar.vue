<template>
  <!-- CalendarView -->
  <div
    class="w-96 h-auto rounded-xl absolute bg-slate-800 top-10 right-0 text-sm text-white p-6 flex flex-col flex-shrink-0">
    <div class="w-full flex items-center justify-between">
      <span class="font-bold">September 2022</span>
      <div class="flex">
        <ChevronLeftIcon class="w-4" />
        <ChevronRightIcon class="w-4" />
      </div>
    </div>
    <div class="grid grid-cols-7 gap-2 mt-4 text-slate-500">
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thur</span>
      <span>Fri</span>
      <span>Sat</span>
      <span>Sun</span>
    </div>
    <div class="grid grid-cols-7 gap-1 mt-4 text-slate-300">
      <div v-for="day in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]" :key="day">
        <div class="h-10 w-10 center rounded-full hover:bg-lime-400 hover:text-slate-700" :class="{ 'bg-lime-400 text-slate-700 font-bold': day === 18 }">
          <span>{{ day }}</span></div>
      </div>
    </div>
    <div class="flex w-full items-center mt-4 space-x-2 font-light">
      <div class="border border-slate-500 text-slate-500 text-sm rounded-full px-2 py-1">Exact Dates</div>
      <div class="border border-slate-500 text-slate-500 text-xs rounded-full px-2 py-2 bg-lime-400 font-bold">+1 Day
      </div>
      <div class="border border-slate-500 text-slate-500 text-sm rounded-full px-2 py-1">+2 Day</div>
      <div class="border border-slate-500 text-slate-500 text-sm rounded-full px-2 py-1">+3 Day</div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { Switch } from '@headlessui/vue'
import {
  ArrowsPointingInIcon,
  ChartBarIcon,
  Square3Stack3DIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
</script>

<style>

</style>