<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavButton from './components/NavButton.vue'
import NavDropdownGuild from "@/components/NavDropdownGuild.vue";
import NavDropdownCharacter from "@/components/NavDropdownCharacter.vue";
import NavDropDownProfil from "@/components/NavDropDownProfil.vue";


import Button from 'primevue/button';

function toggleDarkMode() {
  document.documentElement.classList.toggle('p-app-dark');
}
</script>

<template>
  <body class="flex flex-col h-screen justify-between">
    <nav class="flex space-x-4 justify-around max-h-28 shadow-lg text-2xl uppercase z-2">
      <NavButton text="Recherche" path="/search"/>
      <NavDropdownGuild text="Guilde"/>
      <button class="translate-y-4">
        <RouterLink  to="/">
          <img src="../dfs09-dofawa_orig.png" alt="acceuil" class="max-h-40" />
        </RouterLink>
      </button>
      <NavDropdownCharacter text="Personnages"/>
      <NavDropDownProfil text="Profil" />
    </nav>

    <div class="">
      <RouterView />

    </div>

    <footer class="flex space-x-4 justify-between max-h-28 p-2 z-1">
      <a href='https://ko-fi.com/O5O016KSBS' target='_blank'>
        <img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' />
      </a>
      <p class="text-center">Dofus est un MMORPG édité par Ankama. "dofuccès" est un site non-officiel sans aucun lien avec Ankama.
        Certaines illustrations sont la propriété d'Ankama Studio et de Dofus - Tous droits réservés
        Copyright © 2024 Dofuccès - Merci de ne pas copier le contenu de ce site sans autorisation.</p>
      <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
    </footer>

  </body>

</template>

<style scoped>
*{
  margin: 0;
  font-family: "roboto", sans-serif;
}

nav {
  width: 100%;
  background-color: #FFA124;
  color: white;
}

header a {
  color: white;
  text-decoration: none;
  font-size: 30px;
}
header img {
  height: 125px;
}

</style>