<template>
  <div class="folloers-container">
    <div v-for="(item, index) in followers" :key="index">
      <user-item :item="item" />
    </div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import { dealUsers } from '@/utils/index.js'
  import UserItem from '@/components/userItem/userItem'

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
    components: {
      UserItem
    },
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
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import './followers.scss';
</style>
