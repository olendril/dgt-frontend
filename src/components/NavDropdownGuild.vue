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

interface GuildProps {
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
  <div class="align-middle grow hover:bg-orange-300 basis-8 flex uppercase">
    <button @mouseover="showDropdown = true" @mouseout="showDropdown = false" class="grow uppercase">
      {{ text }}
    </button>

    <ul class="translate-y-28 absolute bg-orange-500 " v-if="showDropdown" :key="idList">
      <li v-for="guild in guilds" :key="guild.id">
        <a href="">{{guild.name}}</a>
      </li>
      <li>
        <RouterLink to="/guild/new">Créer</RouterLink>
      </li>
    </ul>
  </div>


</template>

<style scoped>

</style>