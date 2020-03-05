import Vue from 'vue'
import axios from 'axios'

import store from '@/store'
import {
  VueAxios
} from './axios'
import {
  ACCESS_TOKEN, TOKEN_TIME, USER_DISTRICT, USER_GROUP, USER_PERMISSION, USERNAME
} from '@/store/mutation-types'
import user from '@/store/modules/user.js'
import { refresh } from '@/api/login'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 600 * 1000 // 请求超时时间
})
let refreshing = false;
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN);
  const token_time = Vue.ls.get(TOKEN_TIME);
  if((!token_time || (token_time - Date.now() / 1000 ) / 3600  < 25 ) && !refreshing && token){
    refreshing = true;
    const group2permission = { '市商委': 'business_province', '市民政': 'affairs_province', '区商委': 'business_district', '区民政':'affairs_district'};
    refresh({'token':token}).then(result=>{
      Vue.ls.set(ACCESS_TOKEN, result.token, 2 * 24 * 60 * 60 * 1000)
      Vue.ls.set(TOKEN_TIME, result.exp, 2 * 24 * 60 * 60 * 1000)
      Vue.ls.set(USER_GROUP, result.group,  2 * 24 * 60 * 60 * 1000)
      Vue.ls.set(USER_DISTRICT, result.district,  2 * 24 * 60 * 60 * 1000)
      Vue.ls.set(USERNAME, result.username,  2 * 24 * 60 * 60 * 1000)
      Vue.ls.set(USER_PERMISSION, group2permission[result.group], 2 * 24 * 60 * 60 * 1000)
    }).finally(()=>{
      refreshing = false;
    })
  }
  if (token) {
    config.headers['Authorization'] = 'JWT ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
