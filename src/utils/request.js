import wx from 'wx'
import Fly from 'flyio'
// import { ERR, OK } from '@/utils/config'

const request = new Fly()

request.interceptors.request.use((request) => {
  wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
    // if (response.data.code !== OK) {
    //   wx.showToast({
    //     title: '好像gg了.',
    //     icon: 'success',
    //     duration: 1500
    //   })
    // }
    return promise.resolve(response.data)
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
