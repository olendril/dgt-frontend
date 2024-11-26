<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import axios from "axios";
import type {DungeonInfo} from "@/views/CharacterInfoView.vue";
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore";

interface DungeonSummary {
  name: string;
  level: number;
  id: string;
}

let dungeons : DungeonSummary[] = [];
let refresh = ref(0)
const authStore = useAuthStore();


async function getDungeonSuccess() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get("http://localhost:8080/success/dungeons", {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      let dungeonstmp: Map<string, DungeonInfo> = new Map(Object.entries(response.data))
      dungeonstmp.forEach((value, key:string) => {
        let tmp:DungeonSummary = {
          name: value.name,
          level: value.level,
          id: key
        }
        dungeons.push(tmp)

      })
      console.log(dungeons);
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
import router from "@/router";
onMounted(() => getDungeonSuccess());
</script>

<template>
  Recherche de Donjon pour la guilde
<div class="flex items-center justify-center w-full basis-8">
  <DataTable :value="dungeons" :key="refresh"  sortField="level" :sortOrder="1" paginator :rows="10"
             :rowsPerPageOptions="[5, 10, 20, 50]" >
    <Column field="name" sortable header="Name" > </Column>
    <Column field="level" sortable header="Level" > </Column>
    <Column  label="Level">
      <template #body="{ data}">
        <router-link :to="'/search/dungeons/' + data.id">
          Go
        </router-link>
      </template>
    </Column>

  </DataTable>
</div>
</template>

<style scoped>

</style>