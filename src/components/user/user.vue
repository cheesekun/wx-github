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
      <!-- corner -->
      <div @click="follow" v-if="isCornerShow" class="corner">
        <fixed-corner :content="followContent"></fixed-corner>
      </div>
    </div>
    <div v-if="loading" id="tabs" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
    <Loading v-if="!loading" />
    <swiper v-if="loading" @change="pageChange" :style="{height: height + 'px'}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="info">
        <div class="info-p">
          <div class="follow-area">
            <p v-if="info.name" class="name">{{info.name}}</p>
            <p v-else class="name">{{info.login}}</p>
          </div>
          <p v-if="info.bio">{{info.bio}}</p>
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
        <scroll-view
        :style="{height: height + 'px'}"
        enable-back-to-top="true"
        scroll-y="true"
        @scrolltolower="scrollToLower('event')"
        @scroll="scroll">
          <div class="event-item" v-for="(item, index) in events" :key="index">
            <event-item :event="item"></event-item>
          </div>
          <Loading v-if="event.loading"/>
          <load-end v-else-if="event.loadEnd" />
          <no-data v-else-if="event.noData" />
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="starred">
        <scroll-view
        :style="{height: height + 'px'}"
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
 * TODO: Gist 页面
 */
import api from '@/http/api'
import Tabs from '@/components/tabs/tabs'
import RepoItem from '@/components/repoItem/repoItem'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'
import FixedCorner from '@/components/fixedCorner/fixedCorner'
import EventItem from '@/components/eventItem/eventItem'
import { mapState } from 'vuex'
import {_query, dealRepos, dealEvents} from '@/utils'
/* eslint-disable */
import {per_page, FOLLOW_SUCCESS, FOLLOW_FAIL, DELETE_FOLLOW_SUCCESS, DELETE_FOLLOW_FAIL} from '@/utils/config'
import wx from 'wx'

export default {
  created () {
    wx.getSystemInfo({
      success: (res) => {
        this.height = res.windowHeight
      }
    })

    // 以tabs的比例来计算高度
    let topH = 2 * this.tabsH
    this.height = this.height - topH - this.tabsH

    const pageRoute = this.$root.$mp.page.route
    if (pageRoute.indexOf('/me') === -1) {
      this.isMe = false
      if (this.isLogin) {
        this.isCornerShow = true
      }
    } else {
      this.isMe = true
    }
  },
  onHide () {
  },
  onLoad () {
    this.starreds = []
    this.events = []
    this.currentId = 'info'
    this.currentIndex = 0
  },
  onUnload () {
    this.starred.q.page = 0
    this.event.q.page = 0
  },
  props: {
    info: {
      type: Object,
      default: {}
    },
    followContent: {
      type: String,
      default: 'FOLLOW'
    },
    loading: {
      type: Boolean,
      default: true
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
      isMe: false,
      isCornerShow: false,
      followContent: 'FOLLOW'
    }
  },
  components: {
    Tabs,
    RepoItem,
    Loading,
    LoadEnd,
    NoData,
    FixedCorner,
    EventItem
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
    },
    async getUserEvents () {
      this.event.q.page += 1
      const q = _query(this.event.q)
      let user = this.info.login
      let data = null
      if (this.isMe) {
        data = await api.getMyEvents(user, q)
      } else {
        data = await api.getUserEvents(user, q)
      }
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
      let events = dealEvents(data)
      this.events = this.events.concat(events)
    },
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
      } else if (data.length < per_page) {
        this.starred.loading = false
        this.starred.loadEnd = true
      }
      let starreds = dealRepos(data)
      this.starreds = this.starreds.concat(starreds)
      // this.starreds.push(...starreds)
    },
    async putFollow () {
      const user = this.info.login
      const data = await api.putFollow(user)
      if (data.status === FOLLOW_SUCCESS) {
        this.followContent = 'UNFOLLOW'
      } else if (data.status === FOLLOW_FAIL) {
        this.followContent = 'FOLLOW'
      }
    },
    async deleteFollow () {
      const user = this.info.login
      const data = await api.deleteFollow(user)
      if (data.status === DELETE_FOLLOW_SUCCESS) {
        this.followContent = 'FOLLOW'
      } else if (data.status === DELETE_FOLLOW_FAIL) {
        this.followContent = 'UNFOLLOW'
      }
    },
    follow () {
      if (this.followContent === 'UNFOLLOW') {
        this.deleteFollow()
      } else {
        this.putFollow()
      }
    },
    pageChange (e) {
      const currentItemId = e.mp.detail.currentItemId
      this.currentId = currentItemId

      this.currentIndex = e.mp.detail.current
      if (!this.starreds.length && currentItemId === 'starred') {
        this.getStarred()
      } else if (!this.events.length && currentItemId === 'activity') {
        this.getUserEvents()
      }
    },
    scrollToLower () {
      if (this.currentId === 'starred') {
        this.getStarred()
      } else {
        this.getUserEvents()
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
        icon: 'loading',
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
  },
  computed: {
    ...mapState([
      'tabsH',
      'isLogin'
    ])
  }
}
</script>

<style scoped lang="scss">
  @import './user.scss';
</style>
