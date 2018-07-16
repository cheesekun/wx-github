<template>
  <div class="me-container">
    <!-- <Info :info="info" /> -->
    <User :info="info" />
    <!-- <div class="login">
      登陆页
    </div> -->
  </div>
</template>

<script>
import api from '@/utils/api'
import User from '@/components/user/user'
import { dealUser } from '@/utils'

export default {
  async created () {
    this.info = await this.getMe()
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
    async getMe () {
      const info = dealUser(await api.getMe())
      return info
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './me.scss'
</style>
