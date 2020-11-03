import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icofont/icofont.min.css'
import * as dayjs from 'dayjs'
import Instance from "@/tools/httpRequest";

// import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:8080';
//
// axios.interceptors.request.use(config => {
//     config.headers.Authorization = "Bearer " + window.sessionStorage.getItem("accessToken")
//     return config;
// }, function (error) {
//     return Promise.reject(error)
// });
//
//
// /* 响应拦截器 */
// axios.interceptors.response.use((response) => {
//     return response
// }, error => {
//     if (error.response.status === 403) {
//         console.log('refresh_token过期 超时......')
//         return againRequest(error)
//     }
//     return Promise.reject(error)
// });
//
// async function againRequest(error) {
//     const refreshToken = window.sessionStorage.getItem("refreshToken")
//     if (refreshToken) {
//         await axios.post('/token', {token: refreshToken})
//             .then(async response => {
//                 if (response) {
//                     const data = response.data;
//                     console.log("获取新 token...")
//                     window.sessionStorage.setItem("accessToken", data.accessToken);
//                     const config = error.response.config
//                     config.headers.Authorization = "Bearer " + data.accessToken;
//                     console.log("重新进行原请求...")
//                     return axios.request(config) // 重新进行原请求
//                 }
//             })
//     }
// }

Vue.prototype.$http = Instance;
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')