import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import feedback from './modules/feedback'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    feedback
  },
  state: {
    count: 0
  },
  mutations: {
    increase(state) {
      state.count += 1
    },
    decrease(state) {
      state.count -= 1
    },
    set(state, n) {
      state.count = n
    }
  },
  actions: {
    increaseCount(context) {
      context.commit("increase")
    },
    decreaseCount(context) {
      context.commit("decrease")
    },
    setCount(context, n) {
      context.commit("set", n)
    }
  },
  getters
})
