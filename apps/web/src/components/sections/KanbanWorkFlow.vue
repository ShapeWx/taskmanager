<template>
  <div class="w-full h-20 border-b flex items-center justify-between px-4">
    <div class="flex space-x-4 items-center">
      <MagnifyingGlassIcon class="w-5 h-5" />
      <!-- <input placeholder="Search for something" class="h-full bg-lime-50 h-12" @keyup="searchCard($event)"> -->
      <Input placeholder="Search for something"/>
    </div>
    <div class="flex items-center space-x-2">
      <!-- switch -->
      <div class="flex items-center space-x-2 relative text-sm">
        <Switch v-model="enabled" :class="enabled ? 'bg-lime-400' : 'bg-black'"
          class="relative inline-flex h-[30px] w-[55px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <span class="sr-only">Use setting</span>
          <span aria-hidden="true" :class="enabled ? 'translate-x-[25px]' : 'translate-x-0'"
            class="pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
        </Switch>
        <span>Select Timeframe</span>
        <ChevronUpIcon class="w-4" />
        <!-- Calendar -->
        <Calendar v-if="enabled" />
      </div>

      <Button label="Share" icon="ShareIcon" color="bg-transparent" size="md" drop-down />
    </div>
  </div>

  <div class="w-full h-full flex overflow-auto">
    <div class="w-1/4 border-r flex-shrink-0 text-xs overflow-auto" v-for="column in columns" :key="column">
      <!-- <Card draggable="true" @dragstart="hide(`card-${column}`)" :id="`card-${column}`" v-for="card in cards.filter((el) => el.status === column)" /> -->
      <div class="m-2 p-5 bg-white rounded-lg h-auto border shadow" draggable="true" @dragstart="changeStatus(card.id)"
        :id="card.id" v-for="card in cards.filter((el) => el.status === column)" :key="card">
        <div class="flex items-center justify-between">
          <div class="flex -space-x-4">
            <div class="h-10 w-10 rounded-full border-2 border-slate-500 bg-black" v-for="member in card.members"
              :key="member"></div>
          </div>
          <div class="w-auto px-2 bg-rose-200 text-rose-600 py-1 rounded-full font-bold captalise">{{ card.priority }}
          </div>
        </div>
        <div class="font-bold text-sm my-3">A/B Testing - Round 3</div>
        <div class="flex items-center space-x-1 my-1 text-[10px]">
          <div class="w-auto px-2 bg-blue-200 text-blue-600 py-0.5 rounded-full font-bold captalise">Prototype</div>
          <div class="w-auto px-2 bg-green-200 text-green-600 py-0.5 rounded-full font-bold captalise">Research</div>
          <div class="w-auto px-2 bg-yellow-200 text-yellow-600 py-0.5 rounded-full font-bold captalise">Testing</div>
        </div>
        <div class="flex items-center space-x-2 text-slate-500 font-semibold mt-4 text-[10px]">
          <CalendarIcon class="h-5 stroke-2" />
          <span>{{ card.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
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
  WalletIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline'
import Button from '../shared/Button.vue'
import Input from '../shared/Input.vue'
import Fab from '../shared/Fab.vue'
import Tag from '../shared/Tag.vue'
import Card from '../shared/Card.vue'
import Calendar from '../shared/Calendar.vue'

const enabled = ref(false)

const searchCard = (e) => {
  // console.log(e.target.value)
  let filteredCards = cards.value.filter((card) => card.members.includes(parseInt(e.target.value)));
  if (e.target.value) cards.value = filteredCards;
  console.log(cards.value)
}

const cards = ref([
  { id: 1, status: 'doing', priority: 'high', date: '5th October 2022 - 8th October 2022', members: [1, 2] },
  { id: 2, status: 'done', priority: 'high', date: '5th October 2022 - 8th October 2022', members: [1] },
  { id: 3, status: 'to-do', priority: 'medium', date: '5th October 2022 - 8th October 2022', members: [1, 2, 3] },
  { id: 4, status: 'doing', priority: 'low', date: '5th October 2022 - 8th October 2022', members: [1, 4, 5] },
  { id: 5, status: 'doing', priority: 'low', date: '5th October 2022 - 8th October 2022', members: [1, 3, 4, 5] },
  { id: 6, status: 'to-do', priority: 'low', date: '5th October 2022 - 8th October 2022', members: [1, 3, 4, 5] },
  { id: 7, status: 'to-do', priority: 'low', date: '5th October 2022 - 8th October 2022', members: [1, 4, 5] },
  { id: 8, status: 'doing', priority: 'high', date: '5th October 2022 - 8th October 2022', members: [1, 2, 3, 4, 5] },
  { id: 9, status: 'done', priority: 'high', date: '5th October 2022 - 8th October 2022', members: [1, 2, 3, 4, 5] },
  { id: 10, status: 'verified', priority: 'medium', date: '5th October 2022 - 8th October 2022', members: [1, 2, 3, 4, 5] },
  { id: 11, status: 'refined', priority: 'medium', date: '5th October 2022 - 8th October 2022', members: [1, 2, 3, 4, 5] },
])

const columns = ref(['to-do', 'refined', 'verified', 'doing', 'done'])

const changeStatus = (id) => {
  setTimeout(() => {
    document.getElementById(id).style.display = 'none';
  }, 0)
}
</script>

<style scoped></style>