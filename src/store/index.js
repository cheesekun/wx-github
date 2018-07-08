import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: '',
    tabsH: ''
  },
  mutations: {
    assignTabsH (state, height) {
      state.tabsH = height
    }
  }
})

export default store
