// pages/analysis/analysis.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tab != undefined) {
      this.setData({ TabCur: { 'sheet': 0, 'book': 1, }[options.tab] });
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '稍等片刻',
    });
    var that = this
    wx.request({
      url: getApp().globalData.URL + "getCreated",
      data: {
        'user': wx.getStorageSync('userid')
      },
      success(resl) {
        if (resl.data.code) {
          for (let i in resl.data.data.checkinsheet) {
            resl.data.data.checkinsheet[i]['checkinbook_name'] = null;
            for (let tt in resl.data.data.checkinbook) {
              if (resl.data.data.checkinbook[tt].id == resl.data.data.checkinsheet[i].checkinbook) {
                resl.data.data.checkinsheet[i]['checkinbook_name'] = resl.data.data.checkinbook[tt].name;
                break;
              }
            }
          }
          that.setData({
            checkinsheet: resl.data.data.checkinsheet,
            checkinbook: resl.data.data.checkinbook,
          })
          setTimeout(function () {
            wx.hideLoading();
          }, 350);
        }
      }
    })
  },

  tabSelect: function (e) {
    this.setData({
      TabCur: e.target.dataset.id
    })
  },
  onCheckinsheetTap: function (e) {
    wx.navigateTo({
      url: 'checkinsheet?checkinsheet=' + e.currentTarget.dataset.id,
    })
  },
  onCheckinbookTap: function (e) {
    wx.navigateTo({
      url: 'checkinbook?checkinbook=' + e.currentTarget.dataset.id,
    })
  },
})