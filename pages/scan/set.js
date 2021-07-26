// pages/scan/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    numList: [{
      name: 'PC访问\ndyxd.chng.fun'
    }, {
      name: '扫描二维码'
    }, {
      name: '设置完成'
    }, ],
    checkinsheet: null,
    displayID: null,
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheet: options.checkinsheet
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
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        'checkinsheet': that.data.checkinsheet
      },
      success(resl) {
        if (resl.data.code == 1) {
          if (resl.data.data.checkinsheet.type == 5) {
            that.setData({
              status: 0,
              num:0
            })
          } else {
            that.setData({
              status: 1,
              num:2
            })
          }
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },

  onScanTap() {
    let that0 = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        let data = JSON.parse(res.result)
        let delta = Date.now().toString() - data.time
        if (delta > 6000) {
          wx.showToast({
            title: '二维码已过期，请重新扫码',
            icon: 'none'
          })
        } else {
          let that = that0
          that.setData({num:1})
          wx.request({
            url: getApp().globalData.URL + "display",
            data: {
              action:'regist',
              displayID: data.displayID,
              checkinsheet: that.data.checkinsheet
            },
            success(res) {
              if (res.data.code == 1) {
                that.setSucceeded(res.data.data)
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
  },
  setSucceeded(displayID) {
    this.setData({
      displayID: displayID,
      status:1,
      num:2
    })
  },
  onScanCloseTap(){
    let that = this
    wx.request({
      url: getApp().globalData.URL + "display",
      data: {
        action: 'cancel',
        checkinsheet: that.data.checkinsheet
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            displayID: null,
            status: 0,
            num: 0
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})