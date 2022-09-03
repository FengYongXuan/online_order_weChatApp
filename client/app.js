// app.js
App({
  globalData: {
    userInfo: {},
    appid:null,
    openid:null,
    cusid: null,
    serveraddr: "http://127.0.0.1:3000",
    isLogin: false,
    isAdmin: false
  },
  // 生命周期回调-监听小程序初始化
  onLaunch() {
    var that = this;
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // 获取当前帐号信息
    var accountInfo = wx.getAccountInfoSync();
    that.globalData.appid = accountInfo.miniProgram.appId; // 小程序appId
  },
  // 获取openid并登录
  getOpenId: function () {
    var that = this; // 扩大this作用域，直接用this拿不到globalData
    return new Promise(function(resolve, reject) {
      // 利用wx.login接口拿到res.code，连同appid一起发送到后台换取openId
      wx.login({
        success: res => {
          wx.request({
            url: that.globalData.serveraddr + '/customer/getopenid',
            data: {
              code: res.code,
              appid: that.globalData.appid
            },
            success: res => {
              if (res.statusCode == 200) {
                that.globalData.openid = res.data.openid;
              }else {
                console.log('获取用户登录态失败！' + res.errMsg);
              }
              if (that.globalData.openid) {
                // 用户登录
                wx.request({
                  url: that.globalData.serveraddr + '/customer/login',
                  data: "nickname=" + that.globalData.userInfo.nickName + "&openid=" + that.globalData.openid,
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: r => {
                    //登录注册成功，跳转到菜单页面，登录失败，给客户一个提示
                    if (r.data.result.code == 200) {
                      that.globalData.cusid = r.data.result.cusid;
                      that.globalData.isLogin = true;
                      if (r.data.result.isAdmin) {
                        that.globalData.isAdmin = true;
                      }
                      resolve(that.globalData);
                    }else {
                      //失败
                      wx.showModal({
                        title: '提示',
                        content: '用戶登录失败!'
                      })
                      reject('error');
                    }
                  }
                })
              }
            }
          })
        }
      })
    })
  },
  // 其他界面监听app.globalData.isAdmin，method是一个回调方法
  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "isAdmin", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._isAdmin = value;
        method(value);
      },
      get: function () {
        return this._isAdmin
      }
    })
  },
})
