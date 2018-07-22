<template>
  <div class="wrap">
    <div id="search" class="search-box">
      <input v-model="searchValue" @confirm="search" class="search-input" type="text" placeholder="Search...">
    </div>
    <div class="history" v-if="!repos.length && !users.length">
      <span @click="setSearch(item)" v-for="(item, index) in historys" :key="index" class="item">{{item}}<i @click.stop="delHistory(item)" class="icon-delete icon"></i></span>
      <p v-if="!historys.length">NO SEARCH HISTORY!</p>
    </div>
    <div id="tabs" v-if="repos.length || users.length" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <swiper v-if="showSwiper" class="list" :style="{height: height + 'px'}" @change="pageChange" :current-item-id="currentId" duration="200">
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
          <Loading v-if="repo.loading"/>
          <load-end v-else-if="repo.loadEnd" />
          <no-data v-else-if="repo.noData" />
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
          <Loading v-if="user.loading"/>
          <load-end v-else-if="user.loadEnd" />
          <no-data v-else-if="user.noData" />
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
  import LoadEnd from '@/components/loadEnd/loadEnd'
  import NoData from '@/components/noData/noData'
  import { _query, dealRepos, dealUsers } from '@/utils'
  /* eslint-disable */
  import { per_page } from '@/utils/config'
  import { mapState } from 'vuex'
  import wx from 'wx'

  const warnImg = '/static/img/warn.png'
  let q = ''

  export default {
    onLoad () {
      this.getHistorys()
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
      Loading,
      LoadEnd,
      NoData
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
        repo: {
          loading: false,
          loadEnd: false,
          noData: false
        },
        user: {
          loading: false,
          loadEnd: false,
          noData: false
        },
        historys: [],
        searchValue: '',
        showSwiper: false
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
        if (data.items.length === 0) {
          this.repo.loadEnd = true
          this.repo.loading = false
          this.reposQuery.page -= 1
          return
        }
        let repos = dealRepos(data.items)
        this.repos = this.repos.concat(repos)
      },
      async getUsers () {
        this.usersQuery.page += 1
        let query = _query(this.usersQuery, {q})
        let data = await api.getUsers(query)
        if (data.items.length === 0) {
          this.user.loadEnd = true
          this.user.loading = false
          this.usersQuery.page -= 1
          return
        }
        let users = dealUsers(data.items)
        // this.users.push(...users)
        this.users = this.users.concat(users)
      },
      /**
       * TODO: 这个函数放了太多逻辑，拆一拆
      */
      search (e) {
        q = e.mp.detail.value
        if (q === '') {
          wx.showToast({
            title: '搜索不能为空',
            icon: 'loading',
            image: warnImg,
            duration: 1200
          })
          return
        }
        this.showSwiper = true
        // 重置page
        this.reposQuery.page = this.usersQuery.page = 1


        this.setHistorys(q)

        // 重置loading
        this.repo = {
          loading: false,
          loadEnd: false,
          noData: false
        }
        this.user = {
          loading: false,
          loadEnd: false,
          noData: false
        }

        let reposQuery = _query(this.reposQuery, {q})
        let usersQuery = _query(this.usersQuery, {q})

        let getRepos = api.getRepos(reposQuery)
        let getUsers = api.getUsers(usersQuery)

        Promise.all([getRepos, getUsers]).then(datas => {
          let reposData = datas[0]
          let usersData = datas[1]
          let repos = dealRepos(reposData.items)
          let users = dealUsers(usersData.items)

          if (reposData['total_count'] === 0) {
            this.repo.noData = true
          } else if (reposData['total_count'] <= per_page) {
            this.repo.loadEnd = true
          } else {
            this.repo.loading = true
          }

          if (usersData['total_count'] === 0) {
            this.user.noData = true
          } else if (usersData['total_count'] <= per_page) {
            this.user.loadEnd = true
          } else {
            this.user.loading = true
          }

          this.repos = repos
          this.users = users
        })
      },
      getTab (data) {
        this.currentId = data.id
      },
      scrollToLower () {
        if (this.currentId === 'repos') {
          this.getRepos()
        } else {
          this.getUsers()
        }
      },
      pageChange (e) {
        this.currentId = e.mp.detail.currentItemId
        this.currentIndex = e.mp.detail.current
      },
      /**
       * 获取本地存储的historys
      */
      getHistorys () {
        try {
          let historys = wx.getStorageSync('historys')
          this.historys = JSON.parse(historys)
        } catch (e) {
          wx.setStorage({
            key: 'historys',
            data: '[]'
          })
        }
      },
      /**
       * 存储当前的search value
      */
      setHistorys (value) {
        if (this.historys.indexOf(value) !== -1) return
        const historys = [value, ...this.historys]
        if (historys.length > 6) {
          historys.pop()
        }
        const historysStr = JSON.stringify(historys)
        wx.setStorage({
          key: 'historys',
          data: historysStr
        })
        this.historys = historys
      },
      /**
       * 设置当前search value
      */
      setSearch (value) {
        this.searchValue = value
        // 伪装下e
        let e = {
          mp: {
            detail: {
              value
            }
          }
        }
        this.search(e)
      },
      delHistory (value) {
        let index = this.historys.indexOf(value)
        const clone = JSON.parse(JSON.stringify(this.historys))
        clone.splice(index, 1)
        this.historys = clone

        const historysStr = JSON.stringify(clone)
        wx.setStorage({
          key: 'historys',
          data: historysStr
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './search.scss';
</style>
