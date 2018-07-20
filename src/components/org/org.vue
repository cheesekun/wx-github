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
    <swiper @change="pageChange" :style="{height: height + 'px'}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="info">
        <div class="info-p">
          <div class="follow-area">
            <p v-if="info.name" class="name">{{info.name}}(ORG)</p>
            <p v-else class="name">{{info.login}}(ORG)</p>
          </div>
          <p v-if="info.bio">{{info.bio}}</p>
          <p v-if="info.company"><span class="icon-users icon"></span>{{info.company}}</p>
          <p v-if="info.email"><span class="icon-envelop icon"></span>{{info.email}}</p>
          <p v-if="info.blog"><span class="icon-earth icon"></span>{{info.blog}}</p>
          <div class="info-b">
            <div @click="toMembers(info.login)">
              <p class="b-num">View</p>
              <p>Members</p>
            </div>
            <div @click="toRepos(info.login)">
              <p class="b-num">{{info['public_repos']}}</p>
              <p>Repositories</p>
            </div>
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
    </swiper>
  </div>
</template>

<script>
import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'
import { mapState } from 'vuex'
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
  },
  onHide () {
    // console.log(11)
  },
  onLoad () {
    this.currentId = 'info'
    this.currentIndex = 0
  },
  onUnload () {
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
      }],
      currentId: 'info',
      currentIndex: 0,
      events: [],
      event: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      },
      height: ''
    }
  },
  components: {
    Tabs,
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
    pageChange (e) {
      const currentItemId = e.mp.detail.currentItemId
      this.currentId = currentItemId

      this.currentIndex = e.mp.detail.current
      if (!this.events.length && currentItemId === 'activity') {
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
    toRepos (user) {
      wx.navigateTo({
        url: `/pages/repos/repos?login=${user}`
      })
    },
    toMembers (org) {
      wx.navigateTo({
        url: `/pages/members/members?login=${org}`
      })
    }
  },
  computed: {
    ...mapState([
      'tabsH'
    ])
  }
}
</script>

<style scoped lang="scss">
  @import './org.scss';

</style>
