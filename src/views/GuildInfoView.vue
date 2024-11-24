<script setup lang="ts">
import { useRoute } from 'vue-router'
import {reactive, ref, watch} from "vue";
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
    axios.get("http://localhost:8080/guilds/" + route.params.id, {
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
onMounted(() => getGuildInfo());
</script>

<template>
  <p class="m-52 max-w-sm mx-auto shadow-lg rounded-lg p-8" :key="refresh">
    Nom : {{guild.name}}
    <br>
    Code d'invitation : {{guild.code}}
    <br>
    Server : {{guild.server}}
  </p>
</template>

<style scoped>

</style>