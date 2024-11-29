import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import GuildCreationView from '../views/GuildCreationView.vue'
import GuildInfoView from "@/views/GuildInfoView.vue";
import CharacterCreationView from "@/views/CharacterCreationView.vue";
import CharacterInfoView from "@/views/CharacterInfoView.vue";
import SearchView from "@/views/SearchView.vue";
import ResultDungeonView from "@/views/ResultDungeonView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/newGuild',
      name: 'guildCreation',
      component: GuildCreationView,
    },
    {
      path: '/newCharacter',
      name: 'characterCreation',
      component: CharacterCreationView,
    },
    {
      path: '/guild/:id',
      name: 'guildInfo',
      component: GuildInfoView,
    },
    {
      path: '/characters/:id',
      name: 'characterInfo',
      component: CharacterInfoView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/search/dungeons/:id',
      name: 'searchDungeonResult',
      component: ResultDungeonView,
    },
  ],
})


router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    // We find the token in the cookies
    const token = document.cookie.split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

    if (token === undefined) {
      // User is not authenticated, redirect to login
      next('/login');
    } else {
      // User is authenticated, proceed to the route
      next();
    }
  }else {
    next()
  }
});

export default router
