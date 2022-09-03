// client/pages/usermenu/usermenu.js
var app = getApp();

Page({
  data: {
    myfoodsList: [],
    sumprice: 0,
    serveraddr: app.globalData.serveraddr
  },
  // 生命周期函数--监听页面加载
  onLoad: function(e) {
    this.setData({
      myfoodsList: JSON.parse(e.foodslist),
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {
    var sum = 0;
    for (var i = 0; i < this.data.myfoodsList.length; i++) {
      sum = sum + this.data.myfoodsList[i].gcount * this.data.myfoodsList[i].gprice;
    }
    this.setData({
      sumprice: sum
    })
  },
  // 跳转到支付页面
  gopay: function() {
    wx.redirectTo({
      url: '/pages/pay/pay?sumprice=' + this.data.sumprice + '&foodlist=' + JSON.stringify(this.data.myfoodsList),
    })
  }
})