import wx from 'wx'
import Fly from 'flyio'
import { REQ_ERR, REQ_OK, OAUTH_ERR } from '@/utils/config'

const request = new Fly()

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
        title: '我猜github挂了',
        icon: 'success',
        duration: 1500
      })
    } else if (code === REQ_OK) {
      return promise.resolve(response.data.data)
    } else if (code === OAUTH_ERR) {
      wx.showToast({
        title: '我猜账户密码输入有误',
        icon: 'success',
        duration: 2000
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
