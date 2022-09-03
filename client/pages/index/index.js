// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
  },
  onLoad() {
  }, 
  getUserProfile(e) {
    // 弹出授权框，等待用户授权，从而获取头像和昵称
    wx.getUserProfile({
        desc: '获取你的昵称、头像', // desc属性不能漏
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          wx.navigateTo({
            url: '../login/login'
          })
        }
    })
  }
})
