<template>
  <div
    v-for="item in props.items"
    :key="item"
    @click="openCloseSublists(item.label)"
    class="w-full h-auto flex-col flex -my-2">
    <div class="flex h-12 items-center hover:bg-yellow-100 justify-between p-1 hover:border hover:shadow-md rounded">
      <div class="flex items-center space-x-2 text-sm">
        <component class="h-6 w-6 stroke-2" :is="Icons[item.icon]"></component>
        <span class="font-semibold">{{ item.label }}</span>
      </div>
      <div>
        <component
          class="h-5 w-5 stroke-2"
          :is="Icons['ChevronDownIcon']"
          v-if="item.subList.length > 0 && !subListsOpen.includes(item.label)"
          >
        </component>
        <component
          class="h-5 w-5 stroke-2"
          :is="Icons['ChevronUpIcon']"
          v-if="item.subList.length > 0 && subListsOpen.includes(item.label)"
          >
        </component>
      </div>
    </div>
    <div v-if="item.subList.length > 0 && subListsOpen.includes(item.label)" class="pl-10 space-y-4">
      <div v-for="item in item.subList" :key="item">
        <div :class="{'bg-yellow-300': item.name === 'Statra Insurance'}" class="flex items-center space-x-2 cursor-pointer p-1 rounded">
          <span :class="`h-3 w-3 ${item.color} rounded-full`"></span>
          <span class="text-sm">{{ item.name }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2 cursor-pointer text-sm" @click="showForm(item.name)">
        <component 
          class="h-5 w-5 stroke-2" 
          :is="Icons['PlusCircleIcon']"
          v-if="item.subList.length > 0 && subListsOpen.includes(item.label)"
          >
        </component>
        <span>Add {{ item.name }}</span>
      </div>
    </div>
  </div>

  <Modal>
    <template v-slot:heading>Add {{ selectedForm }}</template>
    <template v-slot:form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'task'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'tag'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'member'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'status'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'project'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
      <form class="grid grid-cols-2 gap-2 -space-y-0" v-if="selectedForm === 'category'">
        <Input placeholder="Title" class="col-span-2"/>
        <Input placeholder="Start Date" type="date"/>
        <Input placeholder="End Date" type="date"/>
        <Input placeholder="Priority" class="col-span-2"/>
        <TextArea rows="5" placeholder="Description" class="col-span-2" />
        <TextArea rows="5" placeholder="Members" class="col-span-2" />
        <Button label="Add new task" icon="PlusIcon" color="bg-lime-500 text-white col-span-2" size="xl" />
      </form>
    </template>
  </Modal>
</template>

<script setup>
import { ref, provide } from 'vue'
import * as Icons from '@heroicons/vue/24/outline'
import Modal from './Modal.vue'
import Input from './Input.vue'
import Button from './Button.vue'
import TextArea from './TextArea.vue'

const props =  defineProps({
  name: [String, Number],
  label: [String, Number],
  icon: [String, Number],
  subList: [Array, Object],
  items: [Array, Object],
})

const subListsOpen = ref([]);

const isOpen = ref(false);

const selectedForm = ref('tag');

provide('isOpenSideModal', isOpen)

const openCloseSublists = (subList) => {
  if(!subListsOpen.value.includes(subList)) subListsOpen.value.push(subList); 
  else {
    let indexOfList = subListsOpen.value.indexOf(subList);
    if (indexOfList !== -1) subListsOpen.value.splice(indexOfList, 1);
  }
}

const showForm = (form) => {
  isOpen.value = true;
  selectedForm.value = form;
  console.log(form, isOpen.value);
} 

</script>

<style>

</style>