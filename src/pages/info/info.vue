<template>
  <div class="info-container">
    <User :info="info" />
  </div>
</template>

<script>
import api from '@/utils/api'
import User from '@/components/user/user'
import { getQuery } from '@/utils'
// import wx from 'wx'

export default {
  /**
   * FIXME: 在点击后退键时，路由问题，mpvue大bug卧槽
   * FIXME: 还是有bug，感觉还是数据清理的问题
   */
  async onShow () {
    this.info = {}
    const options = getQuery()
    const user = options.login
    this.info = await this.getInfo(user)
  },
  /**
   * mpvue 的声明周期没有监听页面卸载
   * 只能利用小程序自带的生命周期了
   */
  onHide () {
    this.info = {}
  },
  data () {
    return {
      info: {}
    }
  },
  components: {
    User
  },
  methods: {
    async getInfo (user) {
      const info = await api.getInfo(user)
      return info
    }
  }
}
</script>

<style scoped lang="scss">
  @import './info.scss';

</style>
