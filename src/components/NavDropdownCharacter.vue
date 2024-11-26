<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import {onBeforeMount, reactive, ref} from "vue";

const authStore = useAuthStore();

// This variable is to update the list
let idList = ref(0)

const props = defineProps({
  text: String,
  path: String,
})

let showDropdown = ref(false);

export interface CharacterProps {
  id: string,
  name: string,
  server: string,
  class: string,
  level: number,
  guild_id: string,
  dungeon_success: string[],
}


let characters = reactive(<CharacterProps[]> {})

function requestGuild() {
  console.log(authStore.getAuthToken());

  return new Promise<string>(async (resolve, reject) => {
      axios.get("http://localhost:8080/characters", {
        headers: {
          'Authorization': 'Bearer ' + authStore.getAuthToken(),
        }
      }).then(function (response) {
        // en cas de réussite de la requête
        //console.log(response.data);
        characters = response.data;
        //console.log(guildsTmp);
        idList.value += 1;
        resolve(response.data);
      })
      .catch(function (error) {
        // en cas d’échec de la requête
        console.log(error);
        reject(error);
      })
  })
}

import { onMounted } from 'vue';
onMounted(() => requestGuild());
</script>

<template>
  <div @mouseover="showDropdown = true" @mouseleave="showDropdown = false" class="align-middle grow basis-8 uppercase rid-cols-1 text-center dropdown">
    <button   class="w-full uppercase min-h-28 hover:bg-orange-300">
      {{ text }}
    </button>

    <ul class="bg-dofawa_orange  border-y border-separator_orange" v-if="showDropdown" :key="idList" z-1>
      <li class="hover:bg-orange-300" v-for="character in characters" :key="character.id">
        <RouterLink :to="{path: '/characters/' + character.id}">{{character.name}}</RouterLink>
      </li>
      <li class="hover:bg-orange-300 bg-white text-black border-t border-separator_orange">
        <RouterLink to="/newCharacter">+ Créer</RouterLink>
      </li>
    </ul>
  </div>


</template>

<style scoped>
.dropdown {
  z-index: 5;
}
</style>