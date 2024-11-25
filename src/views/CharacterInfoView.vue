<script setup lang="ts">
import { useRoute } from 'vue-router'
import {reactive, ref, watch} from "vue";
import axios from "axios";
import {useAuthStore} from "@/stores/authStore";
import type {CharacterProps} from "@/components/NavDropdownCharacter.vue";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';


import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { InputText} from "primevue";

const route = useRoute()
const authStore = useAuthStore();

export interface DungeonInfo {
  name: string
  level: number
  success: Map<string, string>
}

interface DungeonTable {
  level: number
  name: string
  successName: string
  successDone: boolean
  successID: string
}
let character: CharacterProps = <CharacterProps> {}
let dungeonsTable: DungeonTable[] = []

let dungeons: Map<string, DungeonInfo> = new Map()

let refresh = ref(0)

const filters = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    successName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};


async function getCharacterInfo() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get("http://localhost:8080/characters/" + route.params.id, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      character = response.data;
      console.log(character);
      buildTable()
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
        value.success = new Map(Object.entries(value.success))
        dungeons.set(key, value);
      })
      console.log(dungeons);
      buildTable()
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

async function submitSuccess() {
  let checkedSuccess: string[] = []

  for (let i = 0; i < dungeonsTable.length; i++) {
    if (dungeonsTable[i].successDone) {
      checkedSuccess.push(dungeonsTable[i].successID)
    }
  }

  console.log(checkedSuccess)

  return new Promise<string>(async (resolve, reject) => {

    axios.put("http://localhost:8080/characters/" + character.id + "/success/dungeons", checkedSuccess, {
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

function successDone(id :string):boolean {
  return character.dungeon_success.includes(id)
}

function buildTable() {
  dungeons.forEach((dungeon: DungeonInfo, keyDungeon) => {
    dungeon.success.forEach((success, keySuccess) => {
      dungeonsTable.push(<DungeonTable> {
        name: dungeon.name,
        level: dungeon.level,
        successName: success,
        successDone: successDone(keyDungeon + "-" + keySuccess),
        successID: keyDungeon + "-" + keySuccess
      })
    })
  })
  refresh.value += 1
  console.log(dungeonsTable)
}

import { onMounted } from 'vue';
import router from "@/router";
onMounted(() => getCharacterInfo());
onMounted(() => getDungeonSuccess());
onMounted(() => {
  character = <CharacterProps> {}
  dungeonsTable = []

  dungeons = new Map()
});

watch(
    () => route.params.id,
    () => {
      character = <CharacterProps> {}
      dungeonsTable = []

      dungeons = new Map()
      getDungeonSuccess()
      getCharacterInfo()
    }
)

</script>

<template>

<div class="p-12">
  <div class="p-4 text-2xl flex items-end">
    <p class="text-4xl font-bold underline pr-2">{{ character.name }}</p>
    <p>- Niveau.{{ character.level }}</p>
  </div>
  <div class="flex items-center pb-4">
    <p class="pr-2">N'oublie pas de</p>
    <button @click="submitSuccess" class="bg-dofawa_orange rounded-lg p-1">
      SAUVEGARDER
    </button>
    <p class="pl-2">!</p>
  </div>
  <Tabs value="0">
    <TabList class="text-xl flex w-min">
      <Tab value="0">Donjons</Tab>
      <Tab disabled>Avis de Recherche</Tab>
      <Tab disabled>Autres</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <DataTable v-model:filters="filters" :value="dungeonsTable" groupRowsBy="name" rowGroupMode="rowspan" paginator  :rows="50"
                   :rowsPerPageOptions="[ 10, 20, 50, 200, 500]" stripedRows tableStyle="min-width: 50rem" :key="refresh" filterDisplay="row"
                   :global-filter-fields="['name','successName']">
          <template #header>
            <div class="flex justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Recherche" />
              </IconField>
            </div>
          </template>
          <template #empty> Aucun résultat trouvé. </template>
          <template #loading> Chargement des données, patience est mère de vertue! </template>
          <Column field="name" sortable filter-field="name" header="Nom">
            <template #body="{ data }">
              {{ data.name }}
            </template>
          </Column>
          <Column field="successName" sortable filter-field="successName" header="Nom du Succés">
            <template #body="{ data }">
              {{ data.successName }}
            </template>
          </Column>
          <Column field="successDone" sortable  header="Fait">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="slotProps.data.successDone"/>
              </div>
            </template>
          </Column>
          <Column field="level" sortable  header="Niveau"></Column>
        </DataTable>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <button @click="submitSuccess" class="bg-dofawa_orange rounded-lg p-8 m-20">
    Sauvegarder
  </button>
</div>

</template>

<style scoped>

</style>