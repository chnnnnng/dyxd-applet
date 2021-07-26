// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    realname: '',
    phone_bk: '',
    realname_bk: '',
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "userinfo",
      data: {
        userid: wx.getStorageSync('userid')
      },
      success(res) {
        if(res.data.code==1){
          that.setData({
            phone: res.data.data.phone == null ? '':res.data.data.phone,
            realname: res.data.data.realname,
            phone_bk: res.data.data.phone == null ? '' : res.data.data.phone,
            realname_bk: res.data.data.realname
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },

  onphoneinput: function(e) {
    this.setData({
      phone: e.detail.value,
      disabled: (e.detail.value == this.data.phone_bk)&&(this.data.realname==this.data.realname_bk)
    })
  },

  onrealnameinput: function(e) {
    this.setData({
      realname: e.detail.value,
      disabled: (e.detail.value == this.data.realname_bk)&&(this.data.phone==this.data.phone_bk)||(e.detail.value =="")
    })
  },
  onSubmit: function() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "userinfo",
      data: {
        userid: wx.getStorageSync('userid'),
        phone:that.data.phone,
        realname:that.data.realname
      },
      success(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: "修改成功"
          })
          that.setData({
            disabled: true
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  deleteAccount(){
    wx.showModal({
      title: '警告!',
      content: '账号一经注销，您曾创建的所有内容将丢失，您可以重新创建账户，但丢失内容无法找回。注销账号系您的个人行为，小程序不对此负责。',
      confirmColor:"red",
      cancelColor:'green',
      success(res){
        if(res.confirm){
          wx.showModal({
            title: '再次警告！',
            content: '您确认注销账号？注销账号系您的个人行为，小程序不对此负责。',
            confirmColor: "red",
            cancelColor: 'green',
            success(res){
              if(res.confirm){
                wx.request({
                  url: getApp().globalData.URL + "userinfo",
                  data: {
                    userid: wx.getStorageSync('userid'),
                    openid: wx.getStorageSync('openid')
                  },
                  success(res) {
                    if (res.data.code == 1) {
                      wx.showToast({
                        title: "我挥一挥衣袖，不带走一片云彩",
                        icon: 'none',
                        duration:5000
                      })
                      wx.clearStorage()
                      setTimeout(function(){
                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
                      },5000)
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})