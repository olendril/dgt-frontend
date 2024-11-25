<script setup lang="ts">

</script>

<template>
  <div @mouseover="showDropdown = true" @mouseleave="showDropdown = false" class="align-middle grow basis-8 uppercase rid-cols-1 text-center">
    <button   class="w-full uppercase min-h-28 hover:bg-orange-300">
      Profil
    </button>

    <ul class="bg-dofawa_orange  border-y border-separator_orange" v-if="showDropdown" :key="idList">
      <li class="hover:bg-orange-300 bg-white text-black border-t border-separator_orange">
<!--        Déconnection-->
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>