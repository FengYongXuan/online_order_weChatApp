// client/pages/login.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAdmin: false
  },
  onLoad: function () {
    // 监听app.globalData.isAdmin
    getApp().watch((value) => {
      this.setData({
        isAdmin: value
      })
    })
    var that = this;
    // 拿到openid并登录成功，res其实是全局变量app.globalData
    app.getOpenId().then(function (res) {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: res.userInfo, // res.userInfo包括昵称和头像
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于getUserProfile是网络请求，可能会在Page.onLoad之后才返回
        // 所以此处加入callback以防止这种情况
        app.userInfoReadyCallback = res => {
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      }
    })
  },
  joinPage: function (e) {
    // 已登录就跳转到菜单页面
    if (app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/menu/menu'
      })
    }
  },
  // 跳转到管理员页面
  openadmin: function () {
    wx.navigateTo({
      url: '/pages/admin/home/home'
    })
  }
})