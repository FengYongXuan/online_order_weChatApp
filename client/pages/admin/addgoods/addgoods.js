// pages/admin/addgoods/addgoods.js
var app = getApp()

Page({
  data: {
    foodinfo: {},
    typeinfo: {
      "gtid": "1",
      "gtname": "主食",
    },
    radioItems: [{
      name: '主食',
      value: '0'
    },
    {
      name: '水果',
      value: '1',
    },
    {
      name: '甜点',
      value: '2',
    }
    ],
    file_path: '',
    newtypename: null,
    moreflag: false,
    showTopTips: false,
    warning: "",
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var radioItems = []
    // 请求商品种类
    wx.request({
      url: app.globalData.serveraddr + '/admin/getGoodsType',
      success: res => {
        for (let i = 0; i < res.data.goodstypes.length; i++) {
          var items = {}
          items.name = res.data.goodstypes[i].GTNAME
          items.value = res.data.goodstypes[i].GTID - 1
          if (res.data.goodstypes[i].GTID == 1) {
            items.checked = true
          } else {
            items.checked = false
          }
          radioItems.push(items)
        }
        this.setData({
          radioItems: radioItems
        })
      }
    })
  },

  // 监听商品种类单选框变化
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
    wx.request({
      url: app.globalData.serveraddr + '/admin/addGoodsType',
      data: {
        newtypename: e.detail.value.typename,
        gtid: this.data.radioItems.length + 1
      },
      success: res => {
        // console.log(res);
      }
    })
    var newtype = {
      name: "",
      value: '',
      checked: true
    };
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

  // 上传图片
  chooseImage: function (e) {
    var that = this;
    this.setData({
      file_path: '',
    });
    wx.chooseMedia({
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'], // 来源是相册还是相机
      success: function (res) {
        that.setData({
          file_path: res.tempFiles[0].tempFilePath // 拿到本地文件路径
        });
      },
    });
  },

  // 提交表单
  submit: function (e) {
    var that = this;
    var warningflag = false;
    
    if (e.detail.value.foodname == '') {
      this.setData({
        warning: "请输入菜品名称",
      })
      warningflag = true;
    } else {
      this.data.foodinfo.gname = e.detail.value.foodname;
      if (e.detail.value.foodprice == '') {
        this.setData({
          warning: "请输入价格",
        })
        warningflag = true;
      } else {
        this.data.foodinfo.gprice = e.detail.value.foodprice;
        if (e.detail.value.foodtime == '') {
            this.setData({
              warning: "请输入食品制作时间",
            })
            warningflag = true;
          } else {
            this.data.foodinfo.gtime = e.detail.value.foodtime;
            if (e.detail.value.fooddiscribe == '') {
                this.setData({
                  warning: "请输入食品描述",
                })
                warningflag = true;
              } else {
                this.data.foodinfo.ginfo = e.detail.value.fooddiscribe;
                if (this.data.file_path == '') {
                  this.setData({
                    warning: "请添加图片",
                  })
                  warningflag = true;
                } 
                else {
                  this.data.foodinfo.gimg = this.data.file_path;
                  for (var i = 0; i < this.data.radioItems.length; i++) {
                    if (this.data.radioItems[i].checked == true)
                      this.data.foodinfo.gtid = i + 1;
                  }
                }
            }
        }
      }
    }
    if (warningflag == true) {
      var that = this;
      this.setData({
        showTopTips: true
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    } else {
      // 发起添加商品的请求
      wx.request({
        url: app.globalData.serveraddr + '/admin/addGoods',
        data: {
          foodinfo: this.data.foodinfo,
        },
        success: res => {
          if (res.data.result.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
      this.setData({
        foodinfo: this.data.foodinfo,
      });
      // 上传图片
      wx.uploadFile({
        url: app.globalData.serveraddr + '/admin/addGoodsImg',
        filePath: that.data.file_path,  //文件路径
        name: 'fileImg',  //随意
        header: { 
          'Content-Type': 'multipart/form-data'
        },
        formData: {
            'user': 'test'
        },
        success(res) {
          // console.log(res)
        }
      })
      wx.reLaunch({
        url: '/pages/admin/home/home'
      })
    }
  },
})