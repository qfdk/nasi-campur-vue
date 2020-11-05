import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import * as dayjs from 'dayjs'
import Instance from "@/tools/httpRequest";

Vue.prototype.$http = Instance;
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')