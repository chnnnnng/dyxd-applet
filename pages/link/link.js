// pages/link/link.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    checkinsheetid: null,
    checkinsheet: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheetid: options.checkinsheet
    });
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        checkinsheet: that.data.checkinsheetid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            checkinsheet: res.data.data.checkinsheet
          })
          if (res.data.data.checkinsheet.type == 5) { //未开放链接
            that.setData({
              status: 0
            })
            wx.hideShareMenu({

            })
          } else if (res.data.data.checkinsheet.type == 4) { //以开放链接
            that.setData({
              status: 1,
            })
            wx.showShareMenu({

            })
          } else { //错误
            wx.navigateBack({

            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  onOpenTap: function() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "setLink",
      data: {
        checkinsheet: that.data.checkinsheetid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            status: 1
          })
          wx.showToast({
            title: res.data.msg,
          })
          wx.showShareMenu({

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

  onCloseTap: function() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "deleteLink",
      data: {
        checkinsheet: that.data.checkinsheetid
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            status: 0
          })
          wx.showToast({
            title: res.data.msg,
          })
          wx.hideShareMenu({

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let cid = this.data.checkinsheetid
    let name = this.data.checkinsheet.name
    let user = this.data.checkinsheet.user
    return {
      title: user+'发起的「' + name + '」| 点一下到',
      path: '/pages/index/index?linkCheckinsheet=' + cid,
      imageUrl: '/static/imgs/sharecover.jpg'
    }
  },
})