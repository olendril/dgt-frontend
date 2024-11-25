<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavButton from './components/NavButton.vue'
import NavDropdownGuild from "@/components/NavDropdownGuild.vue";
import NavDropdownCharacter from "@/components/NavDropdownCharacter.vue";
import NavDropDownProfil from "@/components/NavDropDownProfil.vue";
</script>

<template>
  <body>
    <nav class="flex space-x-4 justify-around max-h-28 shadow-lg mb-20 text-2xl uppercase">
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

    <RouterView />

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