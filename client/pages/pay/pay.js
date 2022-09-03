// client/pages/pay/pay.js
var app = getApp()

Page({
  data: {
    radioItems: [{
        name: "微信支付",
        value: 'wx',
        img: 'wx.png',
        checked: 'true'
      },
      {
        name: "QQ支付",
        value: 'qq',
        img: 'qq.png'
      },
    ],
    sumprice: 0,
    foodlist: [],
    isPay: false  // 是否支付成功
  },
  // 生命周期函数--监听页面加载
  onLoad: function(e) {
    // 拿到从usermenu页面传来的订单总价和订单信息
    this.setData({
      sumprice: e.sumprice, 
      foodlist: JSON.parse(e.foodlist)
    })
  },
  // 点击支付按钮事件
  openToast: function() {
    var that = this;
    that.setData({
      isPay: true
    })
    // 成功支付，提示并跳转
    if (that.data.isPay) {
      wx.showToast({
        title: '支付成功 跳转',
        icon: 'success',
        duration: 3000,
      });
      wx.request({
        url: app.globalData.serveraddr + '/order/addOrder',
        data: {
          foodlist: JSON.stringify(that.data.foodlist),
          cusid: app.globalData.cusid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          // console.log(res)
        }
      })
      //3s后跳转到用户选餐界面
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/menu/menu'
        })
      }, 3000);
    } else {
      wx.showToast({
        title: '支付失败',
        icon: 'error',
        duration: 3000
      });
    }
  },
  // 监听支付方式单选框(qq、微信)的点击
  radioChange: function(e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  }
})