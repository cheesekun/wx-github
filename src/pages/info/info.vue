<template>
  <div class="info-container">
    <User v-if="info.type === 'User'" :info="info" :followContent="followContent" />
    <Org v-if="info.type === 'Organization'" :info="info" />
  </div>
</template>

<script>
import api from '@/utils/api'
import User from '@/components/user/user'
import Org from '@/components/org/org'
import { getQuery, dealUser } from '@/utils'
import {FOLLOWED, UNFOLLOW} from '@/utils/config'
import { mapState } from 'vuex'
// import wx from 'wx'

export default {
  async onShow () {
    this.info = {}
    const options = getQuery()
    const user = options.login
    this.info = await this.getInfo(user)
    if (this.isLogin && this.info.type === 'User') {
      await this.isFollow(this.info.login)
    }
  },
  /**
   * mpvue 的声明周期没有监听页面卸载
   * 只能利用小程序自带的生命周期了
   */
  onHide () {
    // this.info = {}
  },
  data () {
    return {
      info: {},
      followContent: ''
    }
  },
  components: {
    User,
    Org
  },
  methods: {
    async getInfo (user) {
      const info = dealUser(await api.getInfo(user))
      return info
    },
    async isFollow (user) {
      const data = await api.getIsFollow(user)
      if (data.status === FOLLOWED) {
        this.followContent = 'UNFOLLOW'
      } else if (data.status === UNFOLLOW) {
        this.followContent = 'FOLLOW'
      }
    }
  },
  computed: {
    ...mapState([
      'isLogin'
    ])
  }
}
</script>

<style scoped lang="scss">
  @import './info.scss';

</style>
