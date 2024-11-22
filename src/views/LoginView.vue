<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();

const onLogin = async () => {
  window.location.href = await authStore.getRedirectLink();
}

</script>

<template>
  <section class="m-52 flex">
      <div class="bg-gray-100 basis-52 grow align-middle items-center justify-center">
        <p>
          Merci de vous connecter avec Discord pour accéder à l'application
        </p>
        <button @click="onLogin" class="bg-gray-500 items-center">
          Connexion
        </button>
      </div>
  </section>
</template>

<style scoped>
</style>