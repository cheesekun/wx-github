<template>
  <div class="info-container">
    <div id="top" class="top" :style="{backgroundImage: 'url(' + info['avatar_url'] + ')'}">
      <div class="bg-wrapper"></div>
      <div class="content">
        <img class="avatar" :src="info['avatar_url']" alt="avatar">
        <div class="top-r">
          <p class="login">{{info.login}}</p>
          <p>{{info.location}}</p>
          <p>Joined at {{created_at}}</p>
        </div>
      </div>
    </div>
    <div id="tabs" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <swiper @change="pageChange" :style="{height: height}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="info">
        <div class="info-p">
          <p class="name">{{info.name}}</p>
          <p>{{info.bio}}</p>
          <p><span class="icon-envelop icon"></span>{{info.email}}</p>
          <p><span class="icon-earth icon"></span>{{info.blog}}</p>
          <div class="info-b">
            <div @click="toFollowers(info.login)">
              <p class="b-num">{{info.followers}}</p>
              <p>Followers</p>
            </div>
            <div @click="toFollowing(info.login)">
              <p class="b-num">{{info.following}}</p>
              <p>Following</p>
            </div>
            <div @click="toRepos(info.login)">
              <p class="b-num">{{info['public_repos']}}</p>
              <p>Repositories</p>
            </div>
            <div @click="toGists(info.login)">
              <p class="b-num">{{info['public_gists']}}</p>
              <p>Gists</p>
            </div>
          </div>
          <!-- me -->
          <div class="about">
            <img src="https://avatars0.githubusercontent.com/u/21058528?v=4" alt="cheesekun">
          </div>
        </div>
      </swiper-item>
      <swiper-item item-id="activity">
        <p>2</p>
        <!-- <scroll-view
        class="list-view"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('users')"
        @scroll="scroll">

        </scroll-view> -->
      </swiper-item>
      <swiper-item item-id="starred">
        <scroll-view
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('starred')"
        @scroll="scroll"
        :style="{height: height}">
          <div class="repo-item" v-for="(item, index) in starreds" :key="index">
            <repo-item :repo="item"></repo-item>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
/**
 * FIXME: 在离开info页面时，改变tabs的指向
 * TODO: repos页面
 * TODO: Gist 页面
 */
import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'
import RepoItem from '@/components/repoItem/repoItem'
import {dealRepos} from '@/utils/index'
import moment from 'moment'
import wx from 'wx'

export default {
  // beforeCreate () {
  //   console.log(1)
  // },
  // created () {
  //   console.log(2)
  // },
  // beforeMount () {
  //   console.log(3)
  // },
  // mounted () {
  //   console.log(4)
  // },
  // FIXME: 有点意思
  // beforeUpdate () {
  //   // console.log(5)
  //   this.starreds = []
  //   this.events = []
  //   this.currentId = 'info'
  // },
  // updated () {
  //   console.log(6)
  // },
  // activated () {
  //   console.log(7)
  // },
  // deactivated () {
  //   console.log(8)
  // },
  // beforeDestroy () {
  //   console.log(9)
  // },
  // destroyed () {
  //   console.log(10)
  // },
  // mounted () {
  //   console.log(11)
  //   this.starreds = []
  //   this.events = []
  //   this.currentId = 'info'
  // },
  created () {
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
  // onload () {
  //   console.log(1)
  //   wx.getSystemInfo({
  //     success: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },
  onHide () {
    console.log(2)
    this.starreds = []
    this.events = []
    this.currentId = 'info'
    this.currentIndex = 0
  },
  // onShow () {
  //   console.log(this.info.login)
  // },
  // onUnload () {
  //   console.log(4)
  // },
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      tabs: [{
        id: 'info',
        name: 'INFO'
      }, {
        id: 'activity',
        name: 'ACTIVITY'
      }, {
        id: 'starred',
        name: 'STARRED'
      }],
      currentId: 'info',
      currentIndex: 0,
      events: [],
      starreds: [],
      height: ''
    }
  },
  components: {
    Tabs,
    RepoItem
  },
  computed: {
    created_at () {
      return moment(this.info['created_at']).format('LL')
    }
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
    },
    scrollToLower (currentId) {

    },
    async getEvents () {
      let user = this.info.login
      const data = await api.getEvents(user)
      return data
    },
    async getStarred () {
      let user = this.info.login
      const data = await api.getStarred(user)
      let starreds = dealRepos(data)
      this.starreds = starreds
    },
    pageChange (e) {
      const currentItemId = e.mp.detail.currentItemId
      this.currentId = currentItemId

      this.currentIndex = e.mp.detail.current
      if (!this.starreds.length && currentItemId === 'starred') {
        this.getStarred()
      } else if (!this.events.length && currentItemId === 'activity') {
        // this.getEvents()
      }
    },
    toFollowers (user) {
      wx.navigateTo({
        url: `/pages/followers/followers?login=${user}`
      })
    },
    toFollowing (user) {
      wx.navigateTo({
        url: `/pages/following/following?login=${user}`
      })
    },
    toRepos (user) {
      wx.showToast({
        title: '施工中...',
        icon: 'success',
        duration: 1500
      })
      // wx.navigateTo({
      //   url: `/pages/repos/repos?login=${user}`
      // })
    },
    toGists (user) {
      wx.showToast({
        title: '施工中...',
        icon: 'success',
        duration: 1500
      })
      // wx.navigateTo({
      //   url: `/pages/gists/gists?login=${user}`
      // })
    }
  }
}
</script>

<style scoped lang="scss">
  @import './user.scss';

</style>
