import Vue from 'vue'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { USERPERMISSION, USERNAME } from '../mutation-types'

const userInfo = {
  'id': '4291d7da9005377ec9aec4a71ea837f',
  'name': '海宇小可爱',
  'avatar': '/avatar.png',
  'role': {}
}

const permissions = {
  'business_district': {
    'permissionId': 'business_district',
    'permissionName': '商务委区级账户'
  },
  'business_province': {
    'permissionId': 'business_province',
    'permissionName': '商务委市级账户'
  },
  'affairs_province': {
    'permissionId': 'affairs_province',
    'permissionName': '民政市级账户'
  },
  'affairs_district': {
    'permissionId': 'affairs_district',
    'permissionName': '民政区级账户'
  }
}

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USERNAME, userInfo['username'], 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          commit('SET_NAME', { name: userInfo['username'], welcome: welcome() })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      // 这边获取用户信息用的是一个伪代码

      return new Promise((resolve, reject) => {
        const username = Vue.ls.get(USERNAME)

        // 前端根据用户名生成权限列表，这里应该区分四类用户
        const account2permission = { 'shanghais': 'business_province', 'shanghaim': 'affairs_province'};
        let permissionKey = '';
        if (username in account2permission){
          permissionKey = account2permission[username];
        } else if (username.substring(username.length - 1) === 's') {
          permissionKey = 'business_district';
        } else if(username.substring(username.length - 1) === 'm') {
          permissionKey = 'affairs_district';
        } else {
          console.warn('正常情况下不会到达这里，这里表示账户是非法账户');
          permissionKey = 'business_province';
        }

        userInfo.role.permissions = [ permissions[permissionKey] ]

        // 顺便存储一下
        Vue.ls.set(USERPERMISSION, permissionKey, 7 * 24 * 60 * 60 * 1000)

        const result = userInfo

        result.role.permissions.map(per => {
          if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            per.actionList = per.actionEntitySet.map(action => {
              return action.action
            })
          }
        })
        result.role.permissionList = result.role.permissions.map(permission => { return permission.permissionId })
        commit('SET_ROLES', result.role)
        commit('SET_INFO', result)
        commit('SET_AVATAR', result.avatar)
        resolve(result)
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
