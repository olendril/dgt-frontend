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
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';


import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { InputText } from "primevue";

import Slider from 'primevue/slider';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Inplace from 'primevue/inplace';
import { InputNumber } from 'primevue';
import ToggleSwitch from 'primevue/toggleswitch';

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
    successDone: { value: null, matchMode: FilterMatchMode.EQUALS },
    level: { value: [0, 200], matchMode: FilterMatchMode.BETWEEN }
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};



async function getCharacterInfo() {
  return new Promise<string>(async (resolve, reject) => {
    axios.get(import.meta.env.VITE_BACKEND_URL +  "/characters/" + route.params.id, {
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
          internalErrorGlobal.value = false
          internalErrorGlobal.value = true
          reject(error);
        })
  })
}

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
          internalErrorGlobal.value = false
          internalErrorGlobal.value = true
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

    axios.put(import.meta.env.VITE_BACKEND_URL +  "/characters/" + character.id + "/success/dungeons", checkedSuccess, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      saveSuccessGlobal.value = false
      saveSuccessGlobal.value = true

      resolve(response.data);
    })
        .catch(function (error) {
          // en cas d’échec de la requête
          saveErrorGlobal.value = false
          saveErrorGlobal.value = true
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

async function updateLevel() {
  await new Promise<string>(async (resolve, reject) => {

    axios.post(import.meta.env.VITE_BACKEND_URL +  "/characters/" + character.id + "/level/" + character.level, {}, {
      headers: {
        'Authorization': 'Bearer ' + authStore.getAuthToken(),
      }
    }).then(function (response) {
      // en cas de réussite de la requête
      saveSuccessGlobal.value = false
      saveSuccessGlobal.value = true
      resolve(response.data);
    })
      .catch(function (error) {
        // en cas d’échec de la requête
        saveErrorGlobal.value = false
        saveErrorGlobal.value = true

        console.log(error);
        reject(error);
      })
  })
}

import { onMounted } from 'vue';
import router from "@/router";
import Message from "primevue/message";
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


const userData = ref()


let internalErrorGlobal = ref(false)
let saveErrorGlobal = ref(false)
let saveSuccessGlobal = ref(false)

</script>

<template>

<div class="p-12">
  <div class="text-2xl flex items-center pb-4" :key="refresh">
    <p class="text-4xl font-bold underline pb-2 pr-2">{{ character.name }}</p>
    <p>- Niveau. {{ character.level }}</p>
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
                   :rowsPerPageOptions="[ 10, 20, 50, 200, 500]" stripedRows :key="refresh" filterDisplay="row"
                   :global-filter-fields="['name','successName','level']" sortField="level" :sortOrder="1" removable-sort scrollable scrollHeight="800px">
          <template #header>
            <div class="flex justify-between">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Recherche" />
              </IconField>
              <div class="flex items-center">
                <p class="pr-2">Montrer succès faits :</p>
                <ToggleSwitch v-model="checked" name="showDone" />
              </div>
            </div>
          </template>
          <template #empty> Aucun résultat trouvé. </template>
          <template #loading> Chargement des données, patience est mère de vertue! </template>
          <Column field="name" sortable filter-field="name" header="Nom" class="text-xl">
            <template #body="{ data }">
              {{ data.name }}
            </template>
          </Column>
          <Column field="successDone" header="Fait" class="w-0.5" dataType="boolean">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <input type="checkbox" disabled v-model="slotProps.data.successDone" class="default:ring-2 checked:bg-amber-500"/>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary @change="filterCallback()" />
            </template>
          </Column>
          <Column field="successName" sortable filter-field="successName" header="Nom du Succés">
            <template #body="{ data }">
              {{ data.successName }}
            </template>
          </Column>
          <Column field="level" sortable filter-field="level"  header="Niveau" class="w-0.5" >
          </Column>
        </DataTable>
      </TabPanel>
    </TabPanels>
  </Tabs>
</div>

</template>

<style scoped>

</style>