<template>
  <div class="members-container">
    <div v-for="(item, index) in members" :key="index">
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
      this.members = []
      let user = this.$root.$mp.query.login
      this.members = await this.getMembers(user)
    },
    /**
     * mpvue 的声明周期没有监听页面卸载
     * 只能利用小程序自带的生命周期了
     */
    // onHide () {
    //   this.members = []
    // },
    components: {
      UserItem
    },
    data () {
      return {
        members: []
      }
    },
    methods: {
      async getMembers (org) {
        const data = await api.getMembers(org)
        const members = dealUsers(data)
        return members
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import './members.scss';
</style>
