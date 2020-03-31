import Vue from 'vue'
import App from './App'

import $abotapi from './common/abotapi.js';
Vue.prototype.abotapi = $abotapi
Vue.config.productionTip = false

import openAlert from './components/open-alert/open-alert.vue';
Vue.component('openAlert', openAlert);

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
