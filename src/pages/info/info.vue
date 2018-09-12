<template>
  <div class="info-container">
    <User v-if="info.type === 'User'" :info="info" :loading="!loading" :followContent="followContent" />
    <Org v-if="info.type === 'Organization'" :info="info" :loading="!loading" />
  </div>
</template>

<script>
import api from '@/http/api'
import User from '@/components/user/user'
import Org from '@/components/org/org'
import { getQuery, dealUser } from '@/utils'
import {FOLLOWED, UNFOLLOW} from '@/utils/config'
import { mapState, mapMutations } from 'vuex'
// import wx from 'wx'

export default {
  onShareAppMessage () {
    return {
      title: `user: ${this.info.login}`
    }
  },
  async onLoad () {
    const options = getQuery()
    const user = options.login

    // vuex
    this.userStack.push(options)
    this.info = await this.getInfo(user)

    if (this.isLogin && this.info.type === 'User') {
      this.isFollow(this.info.login)
    }
  },
  async onShow () {
    const options = getQuery()
    // vuex
    let userStack = JSON.parse(JSON.stringify(this.userStack))
    let len = userStack.length
    let endStack = userStack[len - 1]

    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }

    const user = options.login
    this.info = await this.getInfo(user)
    if (this.isLogin && this.info.type === 'User') {
      this.isFollow(this.info.login)
    }
  },
  onHide () {
    // this.info = {}
  },
  onUnload () {
    // vuex
    this.userStack.slice(0, -1)
  },
  data () {
    return {
      info: {},
      followContent: '',
      loading: true
    }
  },
  components: {
    User,
    Org
  },
  methods: {
    async getInfo (user) {
      this.loading = true
      // TODO: 把默认给拆出来
      const info = dealUser(await api.getInfo(user))
      this.loading = false
      return info
    },
    async isFollow (user) {
      const data = await api.getIsFollow(user)
      if (data.status === FOLLOWED) {
        this.followContent = 'UNFOLLOW'
      } else if (data.status === UNFOLLOW) {
        this.followContent = 'FOLLOW'
      }
    },
    ...mapMutations([
      'setUserStack'
    ])
  },
  computed: {
    ...mapState([
      'isLogin',
      'userStack'
    ])
  }
}
</script>

<style scoped lang="scss">
  @import './info.scss';

</style>
