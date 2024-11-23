<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore";
import router from "@/router";

let name = ""
let server = ""

const authStore = useAuthStore();

async function createGuild() {
  return new Promise<string>(async (resolve, reject) => {

    axios.post("http://localhost:8080/guilds", {
      "name":name,
      "server":server,
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
      <label for="name" class="block mb-2 text-sm font-medium">Nom de la guilde</label>
      <input type="text" id="name" class="w-full p-2.5" placeholder="Super Guilde" required v-model="name" />
    </div>
    <div class="mb-5">
      <label for="server" class="block mb-2 text-sm font-medium">Serveur</label>
      <input type="text" id="server" class="w-full p-2.5" placeholder="Dakal 4" required v-model="server"/>
    </div>
    <button type="button" @click="createGuild()" class="">Créer</button>
  </form>
</template>

<style scoped>

</style>