<template>
  <div class="repo-container">
    <div id="top" class="top" :style="{backgroundImage: 'url(' + repo.owner['avatar_url'] + ')'}">
      <div class="bg-wrapper"></div>
      <div class="content">
        <p class="name">{{repo.name}}</p>
        <p class="desc">{{repo.description}}</p>
        <p>Language {{repo.language}}，size {{size}}</p>
      </div>
      <!-- corner -->
      <div @click="star" class="corner">
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
              <p>/{{repo.name}}</p>
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
        <p>activity</p>
        <!-- <scroll-view
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('starred')"
        @scroll="scroll"
        :style="{height: height}">
          <div class="repo-item" v-for="(item, index) in starreds" :key="index">
            <repo-item :repo="item"></repo-item>
          </div>
        </scroll-view> -->
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
import {STARRED, UNSTAR, STAR_SUCCESS, STAR_FAIL, DELETE_STAR_SUCCESS, DELETE_STAR_FAIL} from '@/utils/config'
import { _query, dealRepo, dealCommits } from '@/utils'

import marked from 'marked'
// import wxParse from 'mpvue-wxparse'
import { Base64 } from 'js-base64'
/**
 * TODO: 传入query为 owner & repo
 */
export default {
  onLoad () {
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
    /**
     * FIXME: 为什么清空就会炸呢
    */
    // this.readme = ''
    // this.repo = {}
    // console.log(this.readme)
    // console.log(this.repo)
    this.commits = []
    this.activities = []
    this.currentId = 'info'
    this.currentIndex = 0
  },

  onUnload () {
    this.commit.q.page = 0
    this.activity.q.page = 0
  },

  /**
   * FIXME: 数据加载不应该放在show这一块
   * 至少要加个判断
  */
  async onShow () {
    this.loading = true
    let query = this.$root.$mp.query
    let {owner, repo} = query

    let getRepo = api.getRepo(owner, repo)
    let getReadme = api.getReadme(owner, repo)

    /**
     * FIXME: readme请求太慢了，拆开来
    */
    Promise.all([getReadme, getRepo]).then(datas => {
      this.loading = false
      this.repo = dealRepo(datas[1])
      this.isStar(this.repo.owner.login, this.repo.name)
      if (datas[0].isExist === false) {
        this.readme = '此仓库无README.'
      } else {
        let readme = Base64.decode(datas[0].file.content)
        this.readme = marked(readme)
      }
    })
  },

  onHide () {
    /**
     * 处理掉所有的onHide
    */
    // this.repo = {}
    // this.readme = ''
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
      activities: [],
      commit: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      activity: {
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
    FixedCorner
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
    },
    async getRepo (owner, repo) {
      const data = await api.getRepo(owner, repo)
      return data
    },
    /**
     * TODO: 考虑一下要不要搞触底加载
    */
    async getCommits () {
      this.commit.q.page += 1
      const owner = this.repo.owner.login
      const repo = this.repo.name
      const q = _query(this.commit.q)
      const data = await api.getCommits(owner, repo, q)
      if (data.length === 0) {
        this.commit.loadEnd = true
        this.commit.loading = false
        this.commit.q.page -= 1
        return
      }
      let commits = dealCommits(data)

      // this.commits.push(...commits)
      this.commits = this.commits.concat(commits)
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
      } else if (!this.activities.length && currentItemId === 'activity') {
        // this.getEvents()
      }
    },
    scrollToLower () {
      if (this.currentId === 'commits') {
        this.getCommits()
      } else {
        // this.getUsers()
      }
    }
  },
  computed: {
    size () {
      let repoSize = this.repo.size
      if (this.repo.size < 1024) {
        return repoSize.toFixed(2) + ' KB'
      } else {
        return (repoSize / 1024).toFixed(2) + ' MB'
      }
    }
  }
}
</script>

<style lang='scss'>
  @import './repo.scss';
  @import './wxParse.scss';
</style>
