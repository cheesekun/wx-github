<template>
  <div class="wrap">
    <div id="search" class="search-box">
      <input @confirm="search" class="search-input" type="text" placeholder="Search...">
    </div>
    <div id="tabs" v-if="repos.length" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <swiper class="list" :style="{height: height + 'px'}" @change="pageChange" :current-item-id="currentId" duration="200">
      <swiper-item item-id="repos">
        <scroll-view
        class="list-view"
        :style="{height: height + 'px'}"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('repos')"
        @scroll="scroll">
          <div class="repo-item" v-for="(item, index) in repos" :key="index">
            <repo-item :repo="item"></repo-item>
          </div>
          <div v-show="reposLoading">
            <Loading />
          </div>
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="users">
        <scroll-view
        class="list-view"
        :style="{height: height + 'px'}"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('users')"
        @scroll="scroll">
          <div v-for="(item, index) in users" :key="index">
            <user-item :item="item" />
          </div>
          <div v-show="usersLoading">
            <Loading />
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import Tabs from '@/components/tabs/tabs'
  import RepoItem from '@/components/repoItem/repoItem'
  import UserItem from '@/components/userItem/userItem'
  import Loading from '@/components/loading/loading'
  import { _query, dealRepos, dealUsers } from '@/utils/index.js'
  import { mapState } from 'vuex'
  // import wx from 'wx'

  /**
   * 由于 微信 setData 数据量限制，不能一直累加
   * 所以弄个全局的存放，而不放在 this.data里
   */
  // const [repos, users] = [[], []]

  let q = ''

  export default {
    onLoad () {
      wx.getSystemInfo({
        success: (res) => {
          this.height = res.windowHeight
        }
      })

      let query = wx.createSelectorQuery()
      // 选择id
      query.select('#search').boundingClientRect()

      query.exec(res => {
        let searchH = res[0].height
        this.height = this.height - searchH - this.tabsH
      })
    },
    components: {
      Tabs,
      RepoItem,
      UserItem,
      Loading
    },
    data () {
      return {
        tabs: [{
          id: 'repos',
          name: 'REPOSITORIES'
        }, {
          id: 'users',
          name: 'USERS'
        }],
        users: [],
        usersQuery: {
          page: 1
        },
        repos: [],
        reposQuery: {
          page: 1
        },
        topLen: '0',
        position: 'static',
        currentId: 'repos',
        currentIndex: 0,
        height: '',
        reposLoading: false,
        usersLoading: false
      }
    },
    computed: {
      ...mapState([
        'tabsH'
      ])
    },
    methods: {
      async getRepos () {
        this.reposQuery.page += 1
        let query = _query(this.reposQuery, {q})
        let data = await api.getRepos(query)
        let repos = dealRepos(data.items)
        this.repos.push(...repos)
        this.reposLoading = false
      },
      async getUsers () {
        this.usersQuery.page += 1
        let query = _query(this.usersQuery, {q})
        let data = await api.getUsers(query)
        let users = dealUsers(data.items)
        this.users.push(...users)
        this.usersLoading = false
      },
      search (e) {
        // 重置page
        this.reposQuery.page = this.usersQuery.page = 1
        q = e.mp.detail.value

        let reposQuery = _query(this.reposQuery, {q})
        let usersQuery = _query(this.usersQuery, {q})

        let getRepos = api.getRepos(reposQuery)
        let getUsers = api.getUsers(usersQuery)

        Promise.all([getRepos, getUsers]).then(datas => {
          let repos = dealRepos(datas[0].items)
          let users = dealUsers(datas[1].items)

          this.repos = repos
          this.users = users
          // this.repos.push(...repos)
          // this.users.push(...users)
        })
      },
      getTab (data) {
        this.currentId = data.id
      },
      scrollToLower () {
        if (this.currentId === 'repos') {
          this.reposLoading = this.repos.length
          this.getRepos()
        } else {
          this.usersLoading = this.users.length
          this.getUsers()
        }
      },
      scroll (e) {
        // console.log(e.mp.detail.scrollTop)
        // // 80 是 40 转 rpx
        // if (e.mp.detail.scrollTop > 80) {
        //   this.position = 'fixed'
        //   this.topLen = '0'
        // } else {
        //   this.position = 'static'
        //   this.topLen = '40px'
        // }
      },
      pageChange (e) {
        this.currentId = e.mp.detail.currentItemId
        this.currentIndex = e.mp.detail.current
      }

    }
  }
</script>

<style scoped lang="scss">
  @import './search.scss';
</style>
