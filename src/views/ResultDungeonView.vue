<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref, watch} from "vue";
import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import type {DungeonInfo} from "@/views/CharacterInfoView.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const route = useRoute()
const authStore = useAuthStore();
let refresh = ref(0)


watch(
    () => route.params.id,
    (newId, oldId) => {
      searchDungeonSuccess()
      getDungeonSuccess()
    }
)

interface SearchSuccess {
  character_name: string;
  character_id: string;
  discord_name: string;
  class: string;
  level: number;
  guild_id: string;
  guild_name: string;
  missing_success: string[];
}

let searchResult: SearchSuccess[] = []

async function searchDungeonSuccess() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/characters/success/dungeons/"+ route.params.id + "/search", {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      searchResult = response.data
      console.log(searchResult);
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

let success: Map<string, string> = new Map<string, string>();

async function getDungeonSuccess() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/success/dungeons", {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      let dungeonstmp: Map<string, DungeonInfo> = new Map(Object.entries(response.data))

      success = new Map(Object.entries(dungeonstmp.get(route.params.id).success))
      console.log(success);
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

function isSuccessDone(missingSuccess: string[] , success: string): boolean {
  return !missingSuccess.includes(success);
}

import { onMounted } from 'vue';
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";
onMounted(() => getDungeonSuccess());
onMounted(() => searchDungeonSuccess());

</script>
<template>
  <div class="text-2xl pl-8">
    <p>Résultats :</p>
  </div>
  <div class="p-12">
    <DataTable :value="searchResult" :key="refresh"  sortField="level" :sortOrder="1" paginator :rows="10"
               :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="character_name" sortable header="Name" > </Column>
      <Column field="level" sortable header="Level" > </Column>
      <Column sortable v-for="[key, value] of success"  :header="value">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <input type="checkbox" variant="filled" disabled :checked="isSuccessDone(slotProps.data.missing_success, key)" />
          </div>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<style scoped>

</style>
