// pages/checkin/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: true,
    ic: '',
    checkinsheetid: null,
    checkinsheet: null,
    checkinbook: null,
    roster: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheetid: options.checkinsheet
    });
    var that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        'checkinsheet': that.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
        }
      }
    })
    wx.request({
      url: getApp().globalData.URL + "getIdentitycode",
      data: {
        'checkinsheet': that.data.checkinsheetid,
        'user': wx.getStorageSync('userid')
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({
            ic: resl.data.data
          });
        } else {
          that.setData({
            isDisabled: false
          });
        }
      }
    })
  },
  onInput(e) {
    this.setData({
      ic: e.detail.value
    })
  },
  onCheck(e) {
    if (wx.getStorageSync('name') == "") {
      wx.navigateTo({
        url: '/pages/welcome/welcome?action=fill',
      })
    } else {
      if (this.data.ic != '') {
        let that = this
        wx.request({
          url: getApp().globalData.URL + "putCheckin",
          data: {
            'checkinsheet': this.data.checkinsheetid,
            'user': wx.getStorageSync('userid'),
            'identity_code': this.data.ic
          },
          success(resl) {
            if (resl.data.code == 1) {
              let t = that.data.checkinsheet
              t.num_actual++
                that.setData({
                  checkinsheet: t
                })
              wx.vibrateLong({

              })
              wx.showToast({
                title: '签到成功',
                duration: 5000
              })
            } else {
              wx.showToast({
                title: resl.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    }
  }
})