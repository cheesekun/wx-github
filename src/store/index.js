import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    user: '',
    tabsH: ''
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    comfirmLogin (state, status) {
      state.isLogin = status
    },
    assignTabsH (state, height) {
      state.tabsH = height
    }
  }
})

export default store
