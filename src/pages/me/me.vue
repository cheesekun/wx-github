<template>
  <div class="me-container">
    <!-- <Info :info="info" /> -->
    <User :info="info" v-if="!auth" />
    <div class="login-container" v-else>
      <section class="login" id="login">
        <header>
          <h2>Github</h2>
          <h4>Login</h4>
        </header>
        <form class="login-form">
          <input v-model="username" type="text" class="login-input" placeholder="User" />
          <input v-model="password" type="password" class="login-input" placeholder="Password" />
          <button type="submit" @click="login" class="login-button">SIGN IN</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import User from '@/components/user/user'
import { dealUser } from '@/utils'
import wx from 'wx'

export default {
  async created () {
    this.getAuth()
    // TODO: 记得改回来
    if (this.auth === false) {
      const me = await this.getMe()
      this.info = me
    }
  },
  onLoad () {

  },
  data () {
    return {
      info: {},
      username: '',
      password: '',
      auth: false
    }
  },
  components: {
    User
  },
  methods: {
    async login () {
      const auth = await api.login(this.username, this.password)
      // 如果 auth 为空，也就是说账户密码错误什么的
      if (auth === '') {
        return
      }
      const authStr = JSON.stringify(auth)
      wx.setStorage({
        key: 'auth',
        data: authStr
      })
    },
    async getMe () {
      const info = dealUser(await api.getMe())
      return info
    },
    /**
     * 获取本地存储的auth
    */
    getAuth () {
      try {
        let auth = wx.getStorageSync('auth')
        if (!auth) {
          this.auth = false
        }
        console.log(11)
      } catch (e) {
        this.auth = false
        console.log(22)
        // wx.setStorage({
        //   key: 'auth',
        //   data: '{}'
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './me.scss'
</style>
