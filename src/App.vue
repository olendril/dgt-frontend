<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <nav class="flex items-center justify-between content-center">
      <button>Recherche</button>
      <button>Guilde</button>
      <button>
        <RouterLink to="/">
          <img src="../dfs09-dofawa_orig.png" alt="acceuil">
        </RouterLink>
      </button>
      <button >Personnages</button>
      <button >Profil</button>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
*{
  margin: 0;
  font-family: "Open Sans", sans-serif;
}

header {
  height: 75px;
  width: 100%;
  background-color: #FFA124;
  color: white;
}
header nav {
  list-style: none;
  justify-content: space-around;
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