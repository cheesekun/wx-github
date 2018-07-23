<template>
  <div class="repo-container">
    <div id="top" class="top" :style="{backgroundImage: 'url(' + repo.owner['avatar_url'] + ')'}">
      <div class="bg-wrapper"></div>
      <div class="content">
        <p class="name">{{repo.name}}</p>
        <p class="desc">{{repo.description}}</p>
        <p>Language {{repo.language}}，size {{repo.size}}</p>
      </div>
      <!-- corner -->
      <div v-if="isLogin" @click="star" class="corner">
        <fixed-corner :content="starContent"></fixed-corner>
      </div>
    </div>
    <div id="tabs" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <Loading v-if="loading" />
    <swiper v-if="!loading" @change="pageChange" :style="{height: height}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="info">
        <scroll-view
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true">
          <div class="info-p">
            <div class="name-wrapper">
              <p @click="toUser(repo.owner.login)" class="name">{{repo.owner.login}}</p>
              <p class="repo-name">/{{repo.name}}</p>
            </div>
            <p class="time">Created at {{repo['created_at']}}，Lastest commit {{repo['pushed_at']}}</p>
            <div class="info-b">
              <div>
                <p class="b-num">{{repo['open_issues_count']}}</p>
                <p>issues</p>
              </div>
              <div>
                <p class="b-num">{{repo['stargazers_count']}}</p>
                <p>Stargazers</p>
              </div>
              <div>
                <p class="b-num">{{repo['forks_count']}}</p>
                <p>Forks</p>
              </div>
              <div>
                <p class="b-num">{{repo['subscribers_count']}}</p>
                <p>Watchers</p>
              </div>
            </div>
          </div>
          <div class="readme">
            <h2 class="readme-name">README</h2>
            <!-- <wxParse :content="readme" /> -->
            <wxparser class="wxParse" :rich-text="readme" />
          </div>
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="commits">
        <scroll-view
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('commits')"
        @scroll="scroll">
          <div class="commit-item" v-for="(item, index) in commits" :key="index">
            <commit-item :commit="item"></commit-item>
          </div>
          <Loading v-if="commit.loading"/>
          <load-end v-else-if="commit.loadEnd" />
          <no-data v-else-if="commit.noData" />
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="activity">
        <scroll-view
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('event')"
        @scroll="scroll"
        :style="{height: height}">
          <div class="event-item" v-for="(item, index) in events" :key="index">
            <event-item :event="item"></event-item>
          </div>
          <Loading v-if="event.loading"/>
          <load-end v-else-if="event.loadEnd" />
          <no-data v-else-if="event.noData" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'
import CommitItem from '@/components/commitItem/commitItem'
import FixedCorner from '@/components/fixedCorner/fixedCorner'
import EventItem from '@/components/eventItem/eventItem'
/* eslint-disable */
import {per_page, STARRED, UNSTAR, STAR_SUCCESS, STAR_FAIL, DELETE_STAR_SUCCESS, DELETE_STAR_FAIL} from '@/utils/config'
import { _query, getQuery, dealRepo, dealCommits, dealEvents } from '@/utils'
import { mapState, mapMutations } from 'vuex'
import marked from 'marked'
import { Base64 } from 'js-base64'

export default {
  async onLoad () {
    wx.getSystemInfo({
      success: (res) => {
        this.height = res.windowHeight
      }
    })

    let query = wx.createSelectorQuery()
    // 选择id
    query.select('#top').boundingClientRect()
    query.select('#tabs').boundingClientRect()
    query.exec(res => {
      let topH = res[0].height
      let tabsH = res[1].height

      this.height = this.height - topH - tabsH + 'px'
    })

    const options = getQuery()
    const {owner, repo} = options

    // vuex
    this.repoStack.push(options)
    this.getRepoAndReadme(owner, repo)
  },

  async onShow () {
    const options = getQuery()
    // vuex
    let repoStack = JSON.parse(JSON.stringify(this.repoStack))
    let len = repoStack.length
    let endStack = repoStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }

    const {owner, repo} = options
    this.getRepoAndReadme(owner, repo)
  },

  onHide () {
  },
  onUnload () {
    // 哇，引用类型牛逼
    // vuex
    this.repoStack.slice(0, -1)
  },
  data () {
    return {
      repo: {},
      tabs: [{
        id: 'info',
        name: 'INFO'
      }, {
        id: 'commits',
        name: 'COMMITS'
      }, {
        id: 'activity',
        name: 'ACTIVITY'
      }],
      currentId: 'info',
      currentIndex: 0,
      height: '',
      readme: '',
      commits: [],
      events: [],
      commit: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      event: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      loading: false,
      starContent: 'STAR'
    }
  },
  components: {
    Tabs,
    Loading,
    LoadEnd,
    NoData,
    CommitItem,
    FixedCorner,
    EventItem
  },
  methods: {
    reset () {
      this.commits = []
      this.events = []
      this.currentId = 'info'
      this.currentIndex = 0
      this.loading = true
      this.commit = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
      this.event = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    getTab (data) {
      this.currentId = data.id
    },
    async getRepoAndReadme (owner, repo) {
      this.reset()
      let getRepo = api.getRepo(owner, repo)
      let getReadme = api.getReadme(owner, repo)

      /**
       * FIXME: readme请求太慢了，拆开来
      */
      Promise.all([getReadme, getRepo]).then(datas => {
        this.loading = false
        this.repo = dealRepo(datas[1])
        if (this.isLogin) {
          this.isStar(this.repo.owner.login, this.repo.name)
        }
        if (datas[0].isExist === false) {
          this.readme = '此仓库无README.'
        } else {
          let readme = Base64.decode(datas[0].file.content)
          this.readme = marked(readme)
        }
      })
    },
    async getCommits () {
      this.commit.q.page += 1
      const owner = this.repo.owner.login
      const repo = this.repo.name
      const q = _query(this.commit.q)
      const data = await api.getCommits(owner, repo, q)
      if (data.length === 0) {
        this.commit.loading = false
        this.commit.q.page -= 1
        if (this.commit.q.page === 0) {
          this.commit.noData = true
        } else {
          this.commit.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.commit.loading = false
        this.commit.loadEnd = true
      }
      const commits = dealCommits(data)
      this.commits = this.commits.concat(commits)
    },
    async getRepoEvents () {
      this.event.q.page += 1
      const owner = this.repo.owner.login
      const repo = this.repo.name
      const q = _query(this.event.q)
      const data = await api.getRepoEvents(owner, repo, q)
      if (data.length === 0) {
        this.event.loading = false
        this.event.q.page -= 1
        if (this.event.q.page === 0) {
          this.event.noData = true
        } else {
          this.event.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.event.loading = false
        this.event.loadEnd = true
      }
      const events = dealEvents(data)
      this.events = this.events.concat(events)
    },
    async isStar (owner, repo) {
      const data = await api.getIsStar(owner, repo)
      if (data.status === STARRED) {
        this.starContent = 'UNSTAR'
      } else if (data.status === UNSTAR) {
        this.starContent = 'STAR'
      }
    },
    async putStar () {
      const owner = this.repo.owner.login
      const repo = this.repo.name
      const data = await api.putStar(owner, repo)
      if (data.status === STAR_SUCCESS) {
        this.starContent = 'UNSTAR'
      } else if (data.status === STAR_FAIL) {
        this.starContent = 'STAR'
      }
    },
    async deleteStar () {
      const owner = this.repo.owner.login
      const repo = this.repo.name
      const data = await api.deleteStar(owner, repo)
      if (data.status === DELETE_STAR_SUCCESS) {
        this.starContent = 'STAR'
      } else if (data.status === DELETE_STAR_FAIL) {
        this.starContent = 'UNSTAR'
      }
    },
    star () {
      if (this.starContent === 'UNSTAR') {
        this.deleteStar()
      } else {
        this.putStar()
      }
    },
    toUser (user) {
      wx.navigateTo({
        url: `/pages/info/info?login=${user}`
      })
    },
    pageChange (e) {
      const currentItemId = e.mp.detail.currentItemId
      this.currentId = currentItemId
      this.currentIndex = e.mp.detail.current

      if (!this.commits.length && currentItemId === 'commits') {
        this.getCommits()
      } else if (!this.events.length && currentItemId === 'activity') {
        this.getRepoEvents()
      }
    },
    scrollToLower () {
      if (this.currentId === 'commits') {
        this.getCommits()
      } else {
        this.getRepoEvents()
      }
    },
    ...mapMutations([
      'setRepoStack'
    ])
  },
  computed: {
    ...mapState([
      'isLogin',
      'repoStack'
    ])
  }
}
</script>

<style lang='scss'>
  @import './repo.scss';
  @import './wxParse.scss';
</style>
