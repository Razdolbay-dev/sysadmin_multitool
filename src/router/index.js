import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/password-generator',
      name: 'password-generator',
      component: () => import('@/views/PasswordGeneratorView.vue')
    },
    {
      path: '/network',
      name: 'network',
      component: () => import('@/views/NetworkView.vue')
    },
    {
      path: '/ipoe',
      name: 'ipoe',
      component: () => import('@/views/IPoEView.vue')
    },
    {
      path: '/qinq',
      name: 'qinq',
      component: () => import('@/views/QinQView.vue')
    }
  ]
})

export default router