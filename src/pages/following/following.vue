<template>
  <div class="following-container">
    <div v-for="(item, index) in followings" :key="index">
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
      this.followings = []
      let user = this.$root.$mp.query.login
      this.followings = await this.getFollowings(user)
    },
    components: {
      UserItem
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
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import './following.scss';
</style>
