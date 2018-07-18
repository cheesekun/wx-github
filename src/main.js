import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false
App.store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      '^pages/trending/trending'
      // '^pages/repo/repo'
      // '^pages/search/search'
      // '^pages/about/about'
      // '^pages/me/me'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#099',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white',
      backgroundColor: '#ccc'
    },
    tabBar: {
      color: '#999',
      selectedColor: '#d22222',
      backgroundColor: '#fff',
      borderStyle: 'black',
      list: [{
        pagePath: 'pages/trending/trending',
        text: '热榜',
        iconPath: 'static/img/trending.png',
        selectedIconPath: 'static/img/trending-r.png'
      }, {
        pagePath: 'pages/search/search',
        text: '搜索',
        iconPath: 'static/img/search.png',
        selectedIconPath: 'static/img/search-r.png'
      }, {
        pagePath: 'pages/me/me',
        text: '我',
        iconPath: 'static/img/me.png',
        selectedIconPath: 'static/img/me-r.png'
      }]
    },
    plugins: {
      'wxparserPlugin': {
        'version': '0.1.0',
        'provider': 'wx9d4d4ffa781ff3ac'
      }
    }
  }
}
