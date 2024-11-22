<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();

const onLogin = async () => {
  window.location.href = await authStore.getRedirectLink();
}

</script>

<template>
  <section class=" flex ">
      <div class="bg-gray-100 basis-52 grow align-middle items-center justify-center p-20">
        <p>
          Merci de vous connecter avec Discord pour accéder à l'application
        </p>
        <button @click="onLogin" class="bg-dofawa_orange hover:bg-orange-300 items-center mt-10 p-5 rounded text-white">
          Connexion
        </button>
      </div>
  </section>
</template>

<style scoped>
</style>