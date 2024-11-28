<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import Message from 'primevue/message';
import {ref} from "vue";
const authStore = useAuthStore();

let internalErrorGlobal = ref(false);

const onLogin = async () => {
  await authStore.getRedirectLink().then((url: string) => {
    window.location.href = url;
  }).catch((err: Error) => {
    internalErrorGlobal.value = false;
    internalErrorGlobal.value = true;
  })
}

</script>

<template>
  <Message v-if="internalErrorGlobal" severity="error" class="m-5" life="30000" closable="true">Erreur interne à l'application merci de réessayer plus tard</Message>

  <section class=" flex ">
    <div class="bg-gray-100 basis-52 grow align-middle items-center justify-center p-20 pl-60">
      <p class="text-2xl">
        Merci de vous connecter avec Discord pour accéder à l'application 😁
      </p>
      <button @click="onLogin" class="bg-dofawa_orange hover:bg-orange-300 items-center mt-10 p-5 rounded text-white uppercase ">
        Connexion
      </button>
    </div>
  </section>
</template>

<style scoped>
</style>