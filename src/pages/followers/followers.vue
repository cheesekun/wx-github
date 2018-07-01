<template>
  <div class="folloers-container">
    <div @click="toInfo(item.login)" class="user-item" v-for="(item, index) in followers" :key="index">
      <img class="user-avatar" :src="item['avatar_url']" alt="avatar">
      <p class="user-name">{{item['login']}}</p>
    </div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import { dealUsers } from '@/utils/index.js'

  export default {
    async mounted () {
      this.followers = []
      let user = this.$root.$mp.query.login
      this.followers = await this.getFollowers(user)
    },
    /**
     * mpvue 的声明周期没有监听页面卸载
     * 只能利用小程序自带的生命周期了
     */
    // onHide () {
    //   this.followers = []
    // },
    data () {
      return {
        followers: []
      }
    },
    methods: {
      async getFollowers (user) {
        const data = await api.getFollowers(user)
        const followers = dealUsers(data)
        return followers
      },
      toInfo (user) {
        wx.navigateTo({
          url: `/pages/info/info?login=${user}`
        })
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import './followers.scss';
</style>
