<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();


const props = defineProps({
  text: String,
  path: String,
})

function newGuild() {
  router.push({ path: "/guild/new" });
}


let show = true;
function change () {
  show = !show
}

let guilds = []

async function requestGuild() {
  return new Promise<string>(async (resolve, reject) => {
      axios.get("http://localhost:8080/guilds", {
        headers: {
          'Authorization': 'Bearer ' + authStore.getAuthToken(),
        }
      }).then(function (response) {
        // en cas de réussite de la requête
        console.log(response.data);
        let guildsTmp = response.data;
        for (let i = 0; i < guildsTmp.length; i++) {
          let guild = guildsTmp[i]
          guilds.push(guild.name);
        }
        resolve(response.data);
      })
      .catch(function (error) {
        // en cas d’échec de la requête
        console.log(error);
        reject(error);
      })
  })
}

</script>

<template>
  <div onload="requestGuild()" class="align-middle grow hover:bg-orange-300 basis-8 flex uppercase">
    <button @click="change" class="grow">
      {{ text }}
    </button>
    <button @click="newGuild" v-if="show" class="translate-y-28 absolute bg-orange-500 hover:bg-orange-300 " v-for="item in guilds" :key="item.id">
    </button>
    <button @click="newGuild" v-if="show" class="translate-y-36 absolute bg-orange-500 hover:bg-orange-300 ">
      Créer
    </button>
  </div>


</template>

<style scoped>
.dropdown {
  left: 20%;
}
</style>