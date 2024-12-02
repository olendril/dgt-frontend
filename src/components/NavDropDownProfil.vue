<script setup lang="ts">
import Button from 'primevue/button';
import {ref} from "vue";

let showDropdown = ref(false);
let idList = ref(0)


const disconnect = () => {
  document.cookie = 'access_token=; Path=/; Domain=.dofucces.fr; Expires=Thu, 01 Jan 1970 00:00:01 GMT;;'
  window.location.reload()
}

</script>

<template>
<div @mouseover="showDropdown = true" @mouseleave="showDropdown = false" class="align-middle grow basis-8 uppercase rid-cols-1 text-center">
    <button @click="disconnect" class="w-full uppercase min-h-28 hover:bg-orange-300">
      DÉCONNEXION
    </button>

  </div>

</template>

<style scoped>

</style>