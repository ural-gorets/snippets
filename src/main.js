import Vue from 'vue';
import Vuetify from 'vuetify';
import './plugins/vuetify';
import './plugins/axios';
import App from './App.vue';
import router from './router';
import store from './store';
import VueHighlightJS from 'vue-highlight.js';
import Notifications from '@/components/notifications.vue';

// Required for Highlight.js languages
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import perl from 'highlight.js/lib/languages/perl';
import ruby from 'highlight.js/lib/languages/ruby';
import shell from 'highlight.js/lib/languages/shell';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import php from 'highlight.js/lib/languages/php';

// Import Highlight.js styles
import 'highlight.js/styles/color-brewer.css'; // docco.css


// The global components registration. So it is not needed to 
// import them from other components or views. 
// Just use the appropriate tags.
Vue.component('notifications', Notifications);

Vue.use(Vuetify);

Vue.use(VueHighlightJS, {
  languages: {
    css, javascript, python, perl, ruby,
    shell, xml, sql, php,
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
