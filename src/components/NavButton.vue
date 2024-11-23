<script setup lang="ts">
import router from "@/router";

const props = defineProps({
  text: String,
  path: String,
})

function nextLink() {
  router.push({ path: props.path });
}
</script>

<template>
  <button @click="nextLink()"  class="align-middle grow hover:bg-orange-300 basis-8 uppercase">
    {{ text }}
  </button>
</template>

<style scoped>

</style>