import Vue from 'vue';
import Buefy from 'buefy';
import VueIcon from 'vue-icon';
import 'buefy/dist/buefy.css';

import App from './App';
import store from '../store';

Vue.use(Buefy);
Vue.use(VueIcon, 'v-icon');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>',
}).$mount('#app');
