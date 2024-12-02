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
let printedResult: SearchSuccess[] = []
let guilds:string[] = []
let selectedGuilds:string[] = []


async function searchDungeonSuccess() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/characters/success/dungeons/"+ route.params.id + "/search", {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      searchResult = response.data
      printedResult = response.data
      for (let i = 0; i < searchResult.length; i++) {
        if (!guilds.includes(searchResult[i].guild_name)) {
          guilds.push(searchResult[i].guild_name)
        }
      }
      console.log(searchResult);
      console.log(guilds);
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
import {MultiSelect} from "primevue";
import Checkbox from 'primevue/checkbox';
  onMounted(() => getDungeonSuccess());
onMounted(() => searchDungeonSuccess());

const filters = ref({
  guild_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function updateGuild() {
  printedResult = []
  for (let i = 0; i < searchResult.length ; i++) {
    if (selectedGuilds.includes(searchResult[i].guild_name)) {
      printedResult.push(searchResult[i]);
    }
  }
  refresh.value += 1
}

</script>
<template>
  <div class="text-2xl pl-8">
    <p>Résultats :</p>
  </div>
  <div class="p-12">
    <div class="pb-4">
    <MultiSelect v-model="selectedGuilds" :options="guilds" placeholder="Guildes sélectionnées"
                 :maxSelectedLabels="3" class="w-full md:w-80" @change="updateGuild" />
    </div>

    <DataTable :filter="filters" :value="printedResult" :key="refresh" sortField="level" filterDisplay="row"  :sortOrder="1" paginator :rows="10"
               :rowsPerPageOptions="[5, 10, 20, 50]" :globalFilterFields="['guild_name']">
      <template #empty> Aucun personnage ne correspond à la recherche </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="guild_name" :showFilterMenu="false" header="Nom de Guilde" >
      </Column>
      <Column field="character_name" sortable header="Nom du Personnage" > </Column>
      <Column field="level" sortable header="Niveau" > </Column>
      <Column sortable v-for="[key, value] of success"  :header="value">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <i class="pi" :class="{ 'pi-star-fill text-gray-500 ': isSuccessDone(slotProps.data.missing_success, key), 'pi-star text-amber-500': !isSuccessDone(slotProps.data.missing_success, key) }"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
