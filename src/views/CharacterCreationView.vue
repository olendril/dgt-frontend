<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore";
import router from "@/router";
import OptionsClasses from "@/components/OptionsClasses.vue";
import OptionsServer from "@/components/OptionsServer.vue";

let name = ""
let server = "Ombre"
let classe = "Iop"
let guild = ""
let level:number = 0

const authStore = useAuthStore();

async function createCharacter() {
  return new Promise<string>(async (resolve, reject) => {

    console.log(name, server, guild);
    axios.post("http://localhost:8080/characters", {
      "name":name,
      "server":server,
      "guild_code": guild,
      "class": classe,
      "level":level,
    }, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      console.log(response.data);

      resolve(response.data);
      router.push({ path: "/" });
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
  <form class=" m-52 max-w-sm mx-auto shadow-lg rounded-lg p-8">
    <div class="mb-5">
      <label for="name" class="block mb-2 text-sm font-medium">Nom du personnage</label>
      <input type="text" id="name" class="w-full p-2.5" placeholder="Super Personnage" required v-model="name" />
    </div>
    <div class="mb-5">
      <label for="server" class="block mb-2 text-sm font-medium">Serveur</label>
      <select name="server" id="server" class="w-full p-2.5" v-model="server">
        <OptionsServer />
      </select>
    </div>
    <div class="mb-5">
      <label for="classe" class="block mb-2 text-sm font-medium">Classe</label>
      <select name="classe" id="classe" class="w-full p-2.5" v-model="classe">
        <OptionsClasses />
      </select>
    </div>
    <div class="mb-5">
      <label for="level" class="block mb-2 text-sm font-medium">Niveau</label>
      <input type="number" id="level" class="w-full p-2.5" placeholder="Dakal 4" required v-model="level"/>
    </div>
    <div class="mb-5">
      <label for="guild" class="block mb-2 text-sm font-medium">Code d'invitation de Guilde</label>
      <input type="text" id="guild" class="w-full p-2.5" placeholder="0000-0000-000" required v-model="guild"/>
    </div>
    <button type="button" @click="createCharacter()" class="">Créer</button>
  </form>
</template>

<style scoped>

</style>