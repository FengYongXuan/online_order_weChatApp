// pages/admin/altergoods/altergoods.js
var app = getApp();

Page({
  data: {
    foodinfo: {},
    typeinfo: {
      "gtid": "1",
      "gtname": "主食",
      checked: false,
    },
    radioItems: [{
      name: '主食',
      value: '0',
      checked: false,
    },
    {
      name: '水果',
      value: '1',
      checked: false,
    },
    {
      name: '甜点',
      value: '2',
      checked: false,
    }
    ],
    file_path: '', // 从后台请求过来的商品图片的文件路径
    newtypename: null,
    moreflag: false,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    this.setData({
      foodinfo: JSON.parse(e.foodinfo) // 拿到要修改商品的信息
    })
    this.setData({
      file_path: `${app.globalData.serveraddr}/images/${this.data.foodinfo.GIMG}`
    })
    this.setData({
      radioItems: this.data.radioItems
    })
    var radioItems = []
    wx.request({
      url: app.globalData.serveraddr + '/admin/getGoodsType',
      success: res => {
        for (let i = 0; i < res.data.goodstypes.length; i++) {
          var items = {};
          items.name = res.data.goodstypes[i].GTNAME;
          items.value = res.data.goodstypes[i].GTID - 1;
          if (res.data.goodstypes[i].GTID == 1) {
            items.checked = true;
          } else {
            items.checked = false;
          }
          radioItems.push(items);
        }
        this.setData({
          radioItems: radioItems
        })
        this.data.radioItems[this.data.foodinfo.GTID - "1"].checked = true;
      }
    })
  },

  // 监听单选框变化
  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },

  // 添加商品种类
  addmore: function () {
    this.setData({
      moreflag: true
    });
  },

  // 提交新添加的商品种类
  submitmore: function (e) {
    this.setData({
      newtypename: e.detail.value.typename
    });
    var newtype = {
      name: "",
      value: '',
      checked: true
    };
    wx.request({
      url: app.globalData.serveraddr + '/admin/addGoodsType',
      data: {
        newtypename: e.detail.value.typename,
        gtid: this.data.radioItems.length + 1
      },
      success: res => {
        console.log(res)
      }
    })
    newtype.value = this.data.radioItems.length.toString();
    this.data.typeinfo.gtid = this.data.radioItems.length.toString();
    newtype.name = this.data.newtypename;
    this.data.typeinfo.gtname = this.data.newtypename;
    for (var i = 0; i < this.data.radioItems.length; i++) {
      this.data.radioItems[i].checked = false;
    }
    this.data.radioItems.push(newtype);
    this.setData({
      radioItems: this.data.radioItems,
      moreflag: false,
      typeinfo: this.data.typeinfo,
    });
  },

  // 提交表单事件
  submit: function (e) {
    if (e.detail.value.foodname != '')
      this.data.foodinfo.GNAME = e.detail.value.foodname;
    if (e.detail.value.foodprice != '') {
      this.data.foodinfo.GPRICE = e.detail.value.foodprice;
    }
    if (e.detail.value.fooddiscribe != '')
      this.data.foodinfo.GINFO = e.detail.value.fooddiscribe;
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (this.data.radioItems[i].checked == true)
        this.data.foodinfo.GTID = i + 1;
    }
    this.setData({
      foodinfo: this.data.foodinfo
    });
    // 发起修改商品信息的请求
    wx.request({
      url: app.globalData.serveraddr + '/admin/altergoods',
      data: {
        foodinfo: this.data.foodinfo
      },
      success: res => {
        if (res.data.result.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/admin/home/home'
            })
          }, 1100);
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1000
          });
        }
      }
    })
  }
})