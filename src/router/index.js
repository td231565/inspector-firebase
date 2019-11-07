import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'loading',
    component: () => import('../views/Loading.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../views/Landing.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
