<template>
  <div class="me-container">
    <!-- <Info :info="info" /> -->
    <User :info="info" :login="infoLogin" v-if="auth" />
    <div class="login-container" v-else>
      <section class="login" id="login">
        <header>
          <h2>Github</h2>
          <h4>Login</h4>
        </header>
        <form class="login-form">
          <input v-model="username" type="text" class="login-input" placeholder="User" />
          <input @confirm="login" v-model="password" type="password" class="login-input" placeholder="Password" />
          <button :loading=loginLoading type="submit" @click="login" class="login-button">SIGN IN</button>
        </form>
      </section>
      <div @click="toAbout" class="about">
        <img src="https://avatars0.githubusercontent.com/u/21058528?v=4" alt="cheesekun">
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/http/api'
import User from '@/components/user/user'
import { dealUser } from '@/utils'
import { mapMutations } from 'vuex'
import wx from 'wx'

export default {
  async created () {
    this.getAuth()
    if (this.auth) {
      const me = await this.getMe()
      this.info = me
    }
  },
  onLoad () {

  },
  async onPullDownRefresh () {
    if (this.auth) {
      const me = await this.getMe()
      this.info = me
      wx.stopPullDownRefresh()
    }
  },
  data () {
    return {
      info: {},
      username: '',
      password: '',
      auth: '',
      loginLoading: false,
      infoLogin: false
    }
  },
  components: {
    User
  },
  methods: {
    async login () {
      if (!this.username || !this.password) {
        wx.showToast({
          title: '输入不能为空',
          icon: 'loading',
          image: '/static/img/error.png',
          duration: 1200
        })
        return
      }
      this.loginLoading = true
      const auth = await api.login(this.username, this.password)
      this.loginLoading = false
      // 如果 auth 为空，也就是说账户密码错误什么的
      if (!auth) {
        return
      }
      const authStr = JSON.stringify(auth)
      wx.setStorageSync('auth', authStr)
      this.comfirmLogin(true)
      this.auth = true
      const me = await this.getMe()
      this.info = me
    },
    async getMe () {
      this.infoLogin = true
      const info = dealUser(await api.getMe())
      this.infoLogin = false
      return info
    },
    /**
     * 获取本地存储的auth
    */
    getAuth () {
      let auth = wx.getStorageSync('auth')
      this.auth = auth
    },
    toAbout () {
      wx.navigateTo({
        url: '/pages/about/about'
      })
    },
    ...mapMutations([
      'comfirmLogin'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import './me.scss'
</style>
