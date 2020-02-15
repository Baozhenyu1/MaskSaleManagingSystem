const feedback = {
  state: {
    title: '',
    company: '',
    drug: '',
    detail: '',
    updated: false
  },

  mutations: {
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_DRUG: (state, drug) => {
      state.drug = drug
    },
    SET_DETAIL: (state, detail) => {
      state.detail = detail
    },
    SET_UPDATED: (state, updated) => {
      state.updated = updated
    }
  },

  actions: {
    Store({commit}, data) {
      console.log(data)
      commit('SET_TITLE', data.title)
      commit('SET_COMPANY', data.company)
      commit('SET_DRUG', data.drug)
      commit('SET_DETAIL', data.detail)
      commit('SET_UPDATED', true)
      console.log("feedback", feedback)
    }


  }
}

export default feedback
