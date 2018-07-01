<template>
  <div class="following-container">
    <div @click="toInfo(item.login)" class="user-item" v-for="(item, index) in followings" :key="index">
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
      this.followings = []
      let user = this.$root.$mp.query.login
      this.followings = await this.getFollowings(user)
    },
    data () {
      return {
        followings: []
      }
    },
    methods: {
      async getFollowings (user) {
        const data = await api.getFollowing(user)
        const followings = dealUsers(data)
        return followings
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
  @import './following.scss';
</style>
