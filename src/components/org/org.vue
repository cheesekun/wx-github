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
    </swiper>
  </div>
</template>

<script>
import Tabs from '@/components/tabs/tabs'
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
  },
  onLoad () {
    this.currentId = 'info'
    this.currentIndex = 0
  },
  onUnload () {
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
      }],
      currentId: 'info',
      currentIndex: 0,
      height: ''
    }
  },
  components: {
    Tabs
  },
  methods: {
    getTab (data) {
      this.currentId = data.id
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
