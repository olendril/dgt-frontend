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
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/success/dungeons", {
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
import TabPanel from "primevue/tabpanel";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import Tabs from "primevue/tabs";
import TabPanels from "primevue/tabpanels";
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";
import {InputText} from "primevue";
import IconField from "primevue/iconfield";
import Button from "primevue/button";
import InputIcon from "primevue/inputicon";
import Slider from "primevue/slider";
onMounted(() => getDungeonSuccess());

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  level: { value: null, matchMode: FilterMatchMode.CONTAINS },
});





</script>

<template>
  <p class="text-2xl text-center pb-4 pt-20">Recherche d'équipier :</p>
  <div class="flex items-center justify-center w-full basis-8 pb-12">
    <Tabs value="0">
      <TabList class="text-xl flex w-min">
        <Tab value="0">Donjons</Tab>
        <Tab disabled>Avis de Recherche</Tab>
        <Tab disabled>Autres</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <DataTable  v-model:filters="filters" :value="dungeons" :key="refresh" sortField="level"  :sortOrder="1" paginator :rows="10"
                     :rowsPerPageOptions="[5, 10, 20, 50]" :globalFilterFields="['name', 'level']">
            <template #header>
              <div class="w-full flex items-center justify-center">
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Recherche" />
                </IconField>
              </div>
            </template>
            <template #empty> Aucun résultat trouvé. </template>
            <Column field="name" filter-field="name" sortable header="Name"> </Column>
            <Column field="level" filter-field="level" sortable header="Level">
            </Column>
            <Column  label="go">
              <template #body="{ data }">
                <router-link :to="'/search/dungeons/' + data.id">
                  <button class="bg-dofawa_orange rounded-lg p-1 text-white text-center">
                    GO !
                  </button>
                </router-link>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>

</style>