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
  <div class="align-middle grow hover:bg-orange-300 basis-8 flex uppercase">
    <button @mouseover="showDropdown = true" @mouseout="showDropdown = false"  class="grow uppercase">
      {{ text }}
    </button>

    <ul @mouseover="showDropdown = true" @mouseout="showDropdown = false"  class="translate-y-28 absolute bg-dofawa_orange " v-if="showDropdown" :key="idList">
      <li v-for="character in characters" :key="character.id">
        <RouterLink :to="{path: '/characters/' + character.id}">{{character.name}}</RouterLink>
      </li>
      <li>
        <RouterLink to="/newCharacter">Créer</RouterLink>
      </li>
    </ul>
  </div>


</template>

<style scoped>

</style>