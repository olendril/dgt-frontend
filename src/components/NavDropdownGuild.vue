<script setup lang="ts">
import router from "@/router";
import Dropdown from 'v-dropdown'
import Menu from 'primevue/menu';


const props = defineProps({
  text: String,
  path: String,
})

function nextLink() {
  router.push({ path: props.path });
}

function change (val:boolean) {
  console.log(val)
}

let items = [
    "test1",
    "test2",
]
</script>

<template>
  <button @click="show != show"  class="align-middle grow hover:bg-orange-300 basis-8 ">
    {{ text }}
  </button>
  <div class="grow absolute left-1/5 w-full h-full">
    <button class="translate-y-28   absolute bg-orange-500 hover:bg-orange-300 ">
      test
    </button>
  </div>

</template>

<style scoped>

</style>