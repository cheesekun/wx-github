<template>
  <div class="info-container">
    <div id="top" class="top" :style="{backgroundImage: 'url(' + info['avatar_url'] + ')'}">
      <div class="bg-wrapper"></div>
      <div class="content">
        <img class="avatar" :src="info['avatar_url']" alt="avatar">
        <div class="top-r">
          <p class="login">{{info.login}}</p>
          <p>{{info.location}}</p>
          <p>Joined at {{info['created_at']}}</p>
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
          <p v-if="info.company"><span class="icon-users icon"></span>{{info.company}}</p>
          <p v-if="info.email"><span class="icon-envelop icon"></span>{{info.email}}</p>
          <p v-if="info.blog"><span class="icon-earth icon"></span>{{info.blog}}</p>
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
          <div @click="toAbout" class="about" v-if="isMe">
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
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('starred')"
        @scroll="scroll"
        >
          <div class="repo-item" v-for="(item, index) in starreds" :key="index">
            <repo-item :repo="item"></repo-item>
          </div>
          <Loading v-if="starred.loading"/>
          <load-end v-else-if="starred.loadEnd" />
          <no-data v-else-if="starred.noData" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
/**
 * FIXME: 不应该通过判断starreds 来确定有没有加载star数据，因为可能本来就是空，弄个字段标识空，就不用反复请求了
 * TODO: 添加loading/loadEnd/noData，还有初始转场的loading。
 * TODO: Gist 页面
 */
import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'
import RepoItem from '@/components/repoItem/repoItem'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'
import {_query, dealRepos} from '@/utils/index'
import wx from 'wx'

export default {
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

    const pageRoute = this.$root.$mp.page.route
    if (pageRoute.indexOf('/me') !== -1) {
      this.isMe = true
    }
  },
  onHide () {
    // console.log(11)
  },
  onLoad () {
    // console.log(22)
    this.starreds = []
    this.events = []
    this.currentId = 'info'
    this.currentIndex = 0
  },
  onUnload () {
    // FIXME: 感觉要重构
    // this.currentId = 'starred'
    // this.currentIndex = 2
    // console.log(33)
    this.starred.q.page = 0
    this.event.q.page = 0
  },
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
      event: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      starred: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      height: '',
      isMe: false
    }
  },
  components: {
    Tabs,
    RepoItem,
    Loading,
    LoadEnd,
    NoData
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
    },
    async getEvents () {
      let user = this.info.login
      const data = await api.getEvents(user)
      return data
    },
    /**
     * TODO: 考虑一下要不要搞触底加载
    */
    async getStarred () {
      this.starred.q.page += 1
      let user = this.info.login
      const q = _query(this.starred.q)
      const data = await api.getStarred(user, q)
      if (data.length === 0) {
        this.starred.loading = false
        this.starred.q.page -= 1
        if (this.starred.q.page === 0) {
          this.starred.noData = true
        } else {
          this.starred.loadEnd = true
        }
        return
      }
      let starreds = dealRepos(data)
      this.starreds = this.starreds.concat(starreds)
      // this.starreds.push(...starreds)
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
    scrollToLower () {
      if (this.currentId === 'starred') {
        this.getStarred()
      } else {
        // this.getUsers()
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
      wx.navigateTo({
        url: `/pages/repos/repos?login=${user}`
      })
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
    },
    toAbout () {
      wx.navigateTo({
        url: '/pages/about/about'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import './user.scss';

</style>
