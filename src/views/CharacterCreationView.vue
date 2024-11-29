<script setup lang="ts">
import axios from "axios";
import {ref, getCurrentInstance } from "vue";
import {useAuthStore} from "@/stores/authStore";
import router from "@/router";
import OptionsClasses from "@/components/OptionsClasses.vue";
import OptionsServer from "@/components/OptionsServer.vue";
import Message from "primevue/message";

let name = ""
let server = "Ombre"
let classe = "Iop"
let guild = ""
let level:number = 0

const authStore = useAuthStore();

async function createCharacter() {
  return new Promise<string>(async (resolve, reject) => {

    console.log(name, server, guild);
    axios.post(import.meta.env.VITE_BACKEND_URL +  "/characters", {
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

      const instance = getCurrentInstance();
      instance?.proxy?.$forceUpdate();
      successGlobalMessage.value = false
      successGlobalMessage.value = true
      resolve(response.data);
    })
    .catch(function (error) {

      if (error.response && error.response.status === 404) {
        InvalidGuildError.value = false
        InvalidGuildError.value = true

      } else if (error.response && error.response.status === 500) {
        errorInternalGlobalMessage.value = false
        errorInternalGlobalMessage.value = true

      } else if (error.response && error.response.status === 400) {
        errorInternalGlobalMessage.value = false
        errorInternalGlobalMessage.value = true

      }
      // en cas d’échec de la requête
      console.log(error);
      reject(error);
    })

  })
}

let errorInternalGlobalMessage = ref(false)
let successGlobalMessage = ref(false)
let InvalidGuildError = ref(false)
</script>

<template>
  <Message v-if="errorInternalGlobalMessage" severity="error" class="m-5" life="30000" closable="true">Erreur lors de la création du personnage merci de réessayer plus tard</Message>
  <Message v-if="successGlobalMessage" severity="success" class="m-5" life="30000" closable="true">Sauvegarde réussie !</Message>
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
      <Message v-if="InvalidGuildError" severity="error" class="m-5" life="30000" >Code d'invitation Invalide</Message>

    </div>
    <button type="button" @click="createCharacter()" class="">Créer</button>
  </form>
</template>

<style scoped>

</style>