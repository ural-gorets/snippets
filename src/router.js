import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/upload',
      name: 'Snippet upload',
      component: () => import('@/views/upload.vue'),
    },
    {
      path: '/show/:snip',
      name: 'Snippet',
      component: () => import('@/views/show.vue'),
    },
    {
      path: '/',
      name: 'Snippets list',
      component: () => import('@/views/list.vue'),
    },
  ],
});
