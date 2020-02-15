// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import Notifications from 'vue-notification'

// 引入echarts
import echarts from 'echarts'
import jquery from 'jquery'
import './assets/iconfont/iconfont.css'
import md5 from 'js-md5'

import VCharts from 'v-charts'
//import * as socketApi from './api/socket'
//Vue.prototype.socketApi = socketApi

import * as socketNotice from './api/socket_notice'
Vue.prototype.socketNotice = socketNotice

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
Vue.prototype.$jquery = jquery
Vue.prototype.$md5 = md5

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(Notifications)
Vue.use(VCharts)

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
