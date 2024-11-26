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

export interface GuildProps {
  id: string;
  name: string;
  server: string;
  code: string;
}

let guilds = reactive(<GuildProps[]> {})

function requestGuild() {
  console.log(authStore.getAuthToken());

  return new Promise<string>(async (resolve, reject) => {
      axios.get("http://localhost:8080/guilds", {
        headers: {
          'Authorization': 'Bearer ' + authStore.getAuthToken(),
        }
      }).then(function (response) {
        // en cas de réussite de la requête
        //console.log(response.data);
        let guildsTmp:GuildProps[] = response.data;
        //console.log(guildsTmp);
        guilds = reactive(guildsTmp);
        console.log("Guilds");
        console.log(guilds);
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
  <div  @mouseover="showDropdown = true" @mouseleave="showDropdown = false"  class="align-middle grow basis-8 grid-cols-1 text-center z-3">
    <button   class="w-full uppercase uppercase min-h-28 hover:bg-orange-300">
      {{ text }}
    </button>

    <ul class="bg-dofawa_orange border-y border-separator_orange" v-if="showDropdown" :key="idList">
      <li v-for="guild in guilds" :key="guild.id"  class="hover:bg-orange-300">
        <RouterLink :to="{path: '/guild/' + guild.id}">{{guild.name}}</RouterLink>
      </li>
      <li class="hover:bg-orange-300 border-t border-separator_orange bg-white text-black">
        <RouterLink to="/newGuild">+ Créer</RouterLink>
      </li>
    </ul>
  </div>


</template>

<style scoped>

</style>