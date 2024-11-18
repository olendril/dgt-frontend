<script setup lang="ts">
defineProps({
  text: String
})
</script>

<template>
<button class="align-middle grow hover:bg-orange-300 basis-8 ">
  {{ text }}
</button>
</template>

<style scoped>

</style>