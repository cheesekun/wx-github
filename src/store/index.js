import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    user: '',
    tabsH: '',
    repoStack: [],
    userStack: [],
    followersStack: [],
    followingStack: [],
    membersStack: [],
    reposStack: [],
    stargazersStack: [],
    forksStack: [],
    subscribersStack: []
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
    },
    setRepoStack (state, repoStack) {
      state.repoStack = repoStack
    },
    setUserStack (state, userStack) {
      state.userStack = userStack
    },
    setFollowersStack (state, followersStack) {
      state.followersStack = followersStack
    },
    setFollowingStack (state, followingStack) {
      state.followingStack = followingStack
    },
    setMembersStack (state, membersStack) {
      state.membersStack = membersStack
    },
    setReposStack (state, reposStack) {
      state.reposStack = reposStack
    },
    setStargazersStack (state, stargazersStack) {
      state.stargazersStack = stargazersStack
    },
    setForksStack (state, forksStack) {
      state.forksStack = forksStack
    },
    setSubscribersStack (state, subscribersStack) {
      state.subscribersStack = subscribersStack
    }
  }
})

export default store
