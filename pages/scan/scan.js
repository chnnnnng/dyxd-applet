// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,
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
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        try {
          let data = JSON.parse(res.result)
          let date = new Date(data.t)
          let delta = new Date().getTime() - date.getTime()
          if (delta > 6000) {
            wx.showToast({
              title: '二维码已过期，请重新扫码',
              icon: 'none',
              duration: 3000
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 3000)
          } else {
            let checkinsheetid = data.c - date.getMilliseconds()
            that.setData({ checkinsheetid: checkinsheetid })
            that.onScaned()
          }
        } catch (e) {
          wx.showToast({
            title: '二维码无效，请重新扫码',
            icon: 'none',
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 3000)
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onScaned:function(){
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: { 'checkinsheet': that.data.checkinsheetid },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
          that.setData({status:1});
        }else{
          wx.showToast({
            title: '二维码异常',
            icon: 'none'
          })
        }
      },
      fail(){
        console.log("fail")
      }
    })
    wx.request({
      url: getApp().globalData.URL + "getIdentitycode",
      data: { 'checkinsheet': that.data.checkinsheetid, 'user': wx.getStorageSync('userid') },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({ ic: resl.data.data });
        } else {
          that.setData({ isDisabled: false });
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
    }else{
      if (this.data.ic != '') {
        let that = this
        wx.request({
          url: getApp().globalData.URL + "putCheckin",
          data: { 'checkinsheet': this.data.checkinsheetid, 'user': wx.getStorageSync('userid'), 'identity_code': this.data.ic },
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