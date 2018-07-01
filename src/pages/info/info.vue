<template>
  <div class="info-container">
    <User :info="info" />
  </div>
</template>

<script>
import api from '@/utils/api'
import User from '@/components/user/user'

export default {
  async mounted () {
    this.info = {}
    let user = this.$root.$mp.query.login
    this.info = await this.getInfo(user)
  },
  /**
   * mpvue 的声明周期没有监听页面卸载
   * 只能利用小程序自带的生命周期了
   */
  // onHide () {
  //   this.info = {}
  // },
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
