import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import GuildCreationView from '../views/GuildCreationView.vue'

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
      name: 'home',
      component: LoginView,
    },
    {
      path: '/guild/new',
      name: 'home',
      component: GuildCreationView,
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
  }
  next()
});

export default router
