import Vue from 'vue'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_DISTRICT } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { USER_PERMISSION, USER_GROUP, USERNAME, TOKEN_TIME } from '../mutation-types'

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
          Vue.ls.set(TOKEN_TIME, result.exp, 2 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USERNAME, result.username, 2 * 24 * 60 * 60 * 1000)
          Vue.ls.set(ACCESS_TOKEN, result.token, 2 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USER_GROUP, result.group, 2 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USER_DISTRICT, result.district, 2 * 24 * 60 * 60 * 1000)
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
        const usergroup = Vue.ls.get(USER_GROUP)

        // 前端根据用户名生成权限列表，这里应该区分四类用户
        const account2permission = { '市商委': 'business_province', '市民政': 'affairs_province', '区商委': 'business_district', '区民政':'affairs_district'};
        let permissionKey = '';
        if (usergroup in account2permission){
          permissionKey = account2permission[usergroup];
        }
        const user = {
          'permissionId': 'user',
          'permissionName': '普通用户的权限'
        }
        userInfo.role.permissions = [ permissions[permissionKey], user ]

        // 顺便存储一下
        Vue.ls.set(USER_PERMISSION, permissionKey, 2 * 24 * 60 * 60 * 1000)

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
        resolve();
        // logout(state.token).then(() => {
        //   resolve()
        // }).catch(() => {
        //   resolve()
        // })
      })
    }

  }
}

export default user
