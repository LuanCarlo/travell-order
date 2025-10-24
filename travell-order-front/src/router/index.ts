import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'ordersList',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/LoginView.vue')
  },
   {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/RegisterView.vue')
  },
  {
    path: '/ordersList',
    name: 'ordersList',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderList.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/order/create', 
    name: 'OrderCreate',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderForm.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/order/editar/:id', 
    name: 'OrderEdit',
    component: () => import(/* webpackChunkName: "about" */ '../views/orders/OrderForm.vue'),
    meta: { requiresAuth: true } 
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        
      const userToken = localStorage.getItem('userToken');

      if (userToken) {
          next();
      } else {
          next({ 
              name: 'login', 
              query: { redirect: to.fullPath } 
          });
      }
    } else {
      next();
    }
});

export default router
