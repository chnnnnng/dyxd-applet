// pages/checkinbook/checkinbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkinbookid:null,
    checkinbook:null,
    checkinsheet:null,
    roster:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ checkinbookid: options.checkinbook});
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinbook",
      data: { 'checkinbook':  this.data.checkinbookid},
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
        }
      }
    })
  },
  switchStatus: function (e) {
    let t = this.data.checkinbook;
    t.status = !t.status;
    
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "setCheckinbookStatus",
      data: { 'checkinbook': that.data.checkinbookid, 'status': t.status },
      success(resl) {
        if (resl.data.code == 1) {
          that.onShow()
          that.setData({ checkinbook: t });
        } else {
          wx.showToast({
            title: resl.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  onCheckinsheetTap: function (e) {
    wx.navigateTo({
      url: '/pages/checkinsheet/checkinsheet?checkinsheet=' + e.currentTarget.dataset.id,
    })
  },
  onRosterTap: function (e) {
    wx.navigateTo({
      url: '/pages/roster/roster?roster=' + this.data.roster.id,
    })
  },
  onCreateCheckinsheetTap: function (e) {
    wx.navigateTo({
      url: '/pages/create/create?checkinbook=' + this.data.checkinbook.id,
    })
  },
  onAnalyseTap: function () {
    wx.navigateTo({
      url: '/packageB/pages/analysis/checkinbook?checkinbook=' + this.data.checkinbookid
    })
  },
  onDeleteTap: function () {
    let that = this;
    wx.showModal({
      title: '确认删除？',
      content: '该点名册下的所有点名表将一并删除，且不可恢复！',
      confirmColor: '#ff4040',
      success(resl) {
        if (resl.confirm) {
          wx.request({
            url: getApp().globalData.URL + "deleteCheckinbook",
            data: {
              'checkinbook': that.data.checkinbook.id
            },
            success(resl) {
              if (resl.data.code == 0) {
                wx.showToast({
                  title: resl.data.msg,
                  icon: 'none'
                })
              } else if (resl.data.code == 1) {
                wx.navigateBack({
                  
                })
              }
            }
          })
        } else {

        }
      }
    })
  }
})