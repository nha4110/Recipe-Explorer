import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Favorites from '../views/Favorites.vue'
import Signup from '../views/Signup.vue' 

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup }, 
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// simple auth guard (based on localStorage)
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('recipe_user')
  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
