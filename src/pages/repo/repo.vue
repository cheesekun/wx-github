<template>
  <div class="repo-container">
    <div id="top" class="top" :style="{backgroundImage: 'url(' + repo.owner['avatar_url'] + ')'}">
      <div class="bg-wrapper"></div>
      <div class="content">
        <p class="name">{{repo.name}}</p>
        <p>{{repo.description}}</p>
        <p>Language {{repo.language}}，size {{size}}</p>
      </div>
    </div>
    <div id="tabs" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <swiper @change="pageChange" :style="{height: height}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="info">
        <scroll-view
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true"
        @scroll="scroll">
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
            <wxParse :content="readme" />
          </div>
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="commits">
        <p>2</p>
        <!-- <scroll-view
        class="list-view"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('users')"
        @scroll="scroll">

        </scroll-view> -->
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
import { dealRepo } from '@/utils'

import marked from 'marked'
import wxParse from 'mpvue-wxparse'
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
  },
  /**
   * TODO: readme 和 repo 信息一起获取
   */
  async onShow () {
    let query = this.$root.$mp.query
    let {owner, repo} = query

    let getRepo = api.getRepo(owner, repo)
    let getReadme = api.getReadme(owner, repo)

    Promise.all([getReadme, getRepo]).then(datas => {
      let readme = Base64.decode(datas[0].content)
      this.readme = marked(readme)
      this.repo = dealRepo(datas[1])
    })
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
      readme: ''
    }
  },
  components: {
    Tabs,
    wxParse
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
    },
    async getRepo (owner, repo) {
      const data = await api.getRepo(owner, repo)
      console.log(data)
      return data
    },
    toUser (user) {
      wx.navigateTo({
        url: `/pages/info/info?login=${user}`
      })
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
