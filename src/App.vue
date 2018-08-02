<script>
import { mapMutations } from 'vuex'
import wx from 'wx'

export default {
  created () {
    let auth = wx.getStorageSync('auth')
    if (auth) {
      this.comfirmLogin(true)
    } else {
      this.comfirmLogin(false)
    }
  },
  methods: {
    ...mapMutations([
      'comfirmLogin'
    ])
  }
}
</script>

<style lang="scss">
@import 'styles/fonts.scss';
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
page {
  background-color: #eee;
}
.wxparser--wxParser-code {
  display: inline;
}
</style>
