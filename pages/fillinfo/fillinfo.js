// pages/fillinfo/fillinfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
//    phone: '',
    realname: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    linkCheckinsheet: null,
  },

  onLoad(options) {
    if (options.linkCheckinsheet != undefined) {
      this.setData({
        linkCheckinsheet: options.linkCheckinsheet
      })
    }
  },
  // onphoneinput: function(e) {
  //   this.setData({
  //     phone: e.detail.value
  //   })
  // },

  onrealnameinput: function(e) {
    this.setData({
      realname: e.detail.value
    })
  },
  onSubmit: function() {
    let that = this
    if (this.data.name != '') {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log(res.userInfo);
                var realname = this.data.realname;
                that.filldetail(realname);
              },
              fail: res => {
                console.log("获取用户信息失败");
              }
            })
          } else {
            console.log("未授权获取用户信息");
          }
        }
      })
    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
    }
  },
  filldetail(realname) {
    var openid = wx.getStorageSync("openid");
    var cid = this.data.linkCheckinsheet
    //console.log(openid)
    wx.request({
      url: getApp().globalData.URL + "setUserDetail",
      data: {
        openid: openid,
        name: realname,
      },
      success(resl) {
        console.log(resl);
        if (resl.data.code == 1) {
          wx.setStorageSync('userid', resl.data.data.id);
          wx.setStorageSync('phone', resl.data.data.phone);
          wx.setStorageSync('name', resl.data.data.name);
          wx.reLaunch({
            url: '/pages/index/index' + (cid == null ? '' : ('?linkCheckinsheet=' + cid))
          })
        }
      }
    });
  }
})