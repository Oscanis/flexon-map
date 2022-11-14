import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//import MapView from '../views/MapView.vue'
import UploadView from '../views/UploadView.vue'

const routes = [
  /*{
    path: '/',
    name: 'home',
    component: HomeView
  },*/
  {
    path: '/',
    name: 'upload',
    component: UploadView
    // lazy loading
    //component: () => import('../views/UploadView.vue')
  },
  {
    path: '/map',
    name: 'map',
    // lazy loading
    component: () => import('../views/MapView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
