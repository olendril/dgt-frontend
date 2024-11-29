<script setup lang="ts">
import axios from "axios";
import {getCurrentInstance, ref} from "vue";
import {useAuthStore} from "@/stores/authStore";
import router from "@/router";
import OptionsServer from "@/components/OptionsServer.vue";
import Message from "primevue/message";

let name = ""
let server = "Ombre"

const authStore = useAuthStore();

async function createGuild() {
  return new Promise<string>(async (resolve, reject) => {

    axios.post(import.meta.env.VITE_BACKEND_URL +  "/guilds", {
      "name":name,
      "server":server,
    }, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      successGlobalMessage.value = false
      successGlobalMessage.value = true
      const instance = getCurrentInstance();
      instance?.proxy?.$forceUpdate();
      //window.location.reload()
      resolve(response.data);
    })
    .catch(function (error) {
      // en cas d’échec de la requête
      console.log(error);
      errorGlobalMessage.value = false
      errorGlobalMessage.value = true
      reject(error);
    })

  })
}

let successGlobalMessage = ref(false)
let errorGlobalMessage = ref(false)

</script>

<template>
  <Message v-if="errorGlobalMessage" severity="error" class="m-5" life="30000" closable="true">Erreur lors de la création de la guilde merci de réessayer plus tard</Message>
  <Message v-if="successGlobalMessage" severity="success" class="m-5" life="30000" closable="true">Sauvegarde réussie !</Message>
  <form class=" m-52 max-w-sm mx-auto shadow-lg rounded-lg p-8">
    <div class="mb-5">
      <label for="name" class="block mb-2 text-sm font-medium">Nom de la guilde</label>
      <input type="text" id="name" class="w-full p-2.5" placeholder="Super Guilde" required v-model="name" />
    </div>
    <div class="mb-5">
      <label for="server" class="block mb-2 text-sm font-medium">Serveur</label>
      <select name="server" id="server" class="w-full p-2.5" v-model="server">
        <OptionsServer />
      </select>
    </div>
    <button type="button" @click="createGuild()" class="">Créer</button>
  </form>
</template>

<style scoped>

</style>