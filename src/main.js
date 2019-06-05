import Vue from 'vue';
import Vuetify from 'vuetify';
import './plugins/vuetify';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from '@/components/notifications.vue';

// The global components registration. So it is not needed to 
// import them from other components or views. 
// Just use the appropriate tags.
Vue.component('notifications', Notifications);
//Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

Vue.use(Vuetify);
