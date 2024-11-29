<script setup lang="ts">
import { useRoute } from 'vue-router'
import {inject, reactive, ref, watch} from "vue";
import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import {GuildProps} from "@/components/NavDropdownGuild.vue";

const route = useRoute()

watch(
    () => route.params.id,
    (newId, oldId) => {
      getGuildInfo()
    }
)

const authStore = useAuthStore();

let guild: GuildProps = <GuildProps> {}

let refresh = ref(0)

async function getGuildInfo() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/guilds/" + route.params.id, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      guild = response.data;
      refresh.value += 1
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
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import router from "@/router";
import Message from "primevue/message";
onMounted(() => getGuildInfo());

let deleted = false
let deleteModal = ref(false)
let deleteErrorGlobal = ref(false)


const refreshGuild = inject('refreshGuild')


async function deleteGuild() {
  deleted = true

  return new Promise<string>(async (resolve, reject) => {
    axios.delete(import.meta.env.VITE_BACKEND_URL +  "/guilds/" + guild.id , {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      refreshGuild()
      router.push('/')
      resolve(response.data);
    })
        .catch(function (error) {
          // en cas d’échec de la requête
          deleted = false
          deleteErrorGlobal.value = false
          deleteErrorGlobal.value = true
          console.log(error);
          reject(error);
        })

  })
}
</script>

<template>
  <Message v-if="deleteErrorGlobal" severity="error" class="m-5" life="30000" closable="true">Echec lors de la suppression</Message>

  <Dialog v-model:visible="deleteModal" modal header="Suppression du Personnage" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Êtes-vous sûr de vouloir supprimer votre guilde ?</span>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Annuler" severity="secondary" @click="deleteModal = false"></Button>
      <Button type="button" label="Supprimer" severity="danger" @click="deleteModal = false; deleteGuild()"></Button>
    </div>
  </Dialog>
  <p class="m-52 max-w-sm mx-auto shadow-lg rounded-lg p-8" :key="refresh">
    Nom : {{guild.name}}
    <br>
    Code d'invitation : {{guild.code}}
    <br>
    Server : {{guild.server}}
  </p>
  <button @click="deleteModal = true" class="bg-red-600 rounded-lg p-1">SUPPRIMER LA GUILDE</button>

</template>

<style scoped>

</style>