// pages/created/created.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tab != undefined) {
      this.setData({ TabCur: { 'single': 0, 'all': 1, 'book': 2, 'roster': 3 }[options.tab] });
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
            resl.data.data.checkinsheet[i]['roster_name'] = null;
            for (let tt in resl.data.data.checkinbook) {
              if (resl.data.data.checkinbook[tt].id == resl.data.data.checkinsheet[i].checkinbook) {
                resl.data.data.checkinsheet[i]['checkinbook_name'] = resl.data.data.checkinbook[tt].name;
                break;
              }
            }
            for (let tt in resl.data.data.roster) {
              if (resl.data.data.roster[tt].id == resl.data.data.checkinsheet[i].roster) {
                resl.data.data.checkinsheet[i]['roster_name'] = resl.data.data.roster[tt].name;
                break;
              }
            }
          }
          that.setData({
            checkinsheet: resl.data.data.checkinsheet,
            checkinbook: resl.data.data.checkinbook,
            roster: resl.data.data.roster
          })
          setTimeout(function () {
            wx.hideLoading();
          }, 350);
        }
      }
    })
  },

  tabSelect: function(e){
    this.setData({
      TabCur:e.target.dataset.id
    })
  },
  onCheckinsheetTap: function(e){
    wx.navigateTo({
      url: '/pages/checkinsheet/checkinsheet?checkinsheet='+e.currentTarget.dataset.id,
    })
  },
  onCheckinbookTap: function(e){
    wx.navigateTo({
      url: '/pages/checkinbook/checkinbook?checkinbook=' + e.currentTarget.dataset.id,
    })
  },
  onRosterTap: function (e) {
    wx.navigateTo({
      url: '/pages/roster/roster?roster=' + e.currentTarget.dataset.id,
    })
  },
  onCreateRosterTap : function(e){
    wx.redirectTo({
      url: '/pages/createRoster/createRoster',
    })
  },
  onCreateCheckinbookTap : function(e){
    wx.redirectTo({
      url: '/pages/createCheckinbook/createCheckinbook',
    })
  }
})