<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import axios from "axios";

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
</script>

<template>
<div class="flex items-center justify-center w-full basis-8">
  <DataTable>
    <Column>
    </Column>
  </DataTable>
</div>
</template>

<style scoped>

</style>