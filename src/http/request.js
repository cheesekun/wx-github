import wx from 'wx'
import Fly from 'flyio'
import { REQ_ERR, REQ_OK, OAUTH_ERR } from '@/utils/config'

const errorImg = '../../static/img/error.png'

const request = new Fly()

request.config = {
  // baseURL: 'https://api.github.com',
  baseURL: 'https://github.konsonx.com'
}

function getAuth () {
  let headers = {}
  let auth = wx.getStorageSync('auth')
  if (auth === '') {
    headers = {
      'x-id': 0,
      'Authorization': ''
    }
  } else {
    let authObj = JSON.parse(auth)
    headers['x-id'] = authObj['oauth_id']
    headers['Authorization'] = authObj['hash_token']
  }
  return headers
}

request.interceptors.request.use((request) => {
  request.headers = getAuth()
  wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
    const code = response.data.code
    if (code === REQ_ERR) {
      wx.showToast({
        title: '服务出错!',
        icon: 'loading',
        image: errorImg,
        duration: 1200
      })
    } else if (code === REQ_OK) {
      return promise.resolve(response.data.data)
    } else if (code === OAUTH_ERR) {
      wx.showToast({
        title: '输入有误！',
        icon: 'loading',
        image: errorImg,
        duration: 1200
      })
      return promise.resolve(response.data.data)
    }
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
    return promise.resolve()
  }
)

export default request
