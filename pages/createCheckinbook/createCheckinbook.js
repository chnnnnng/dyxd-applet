// pages/createCheckinbook/createCheckinbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rosterPicker: [],
    rosterIndex: null,
    name: null,
    roster: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: getApp().globalData.URL + "getBookAndRoster",
      data: {
        'user': wx.getStorageSync('userid')
      },
      success(resl) {
        if (resl.data.code) {
          var t1 = [];
          for (let i in resl.data.data.roster) {
            t1[i] = resl.data.data.roster[i].name;
          }
          that.setData({
            roster: resl.data.data.roster,
            rosterPicker: t1,
          })
          if(options.roster != undefined){
            for(let j in that.data.roster){
              if(that.data.roster[j].id == options.roster){
                that.setData({
                  rosterIndex:j
                })
                break;
              }
            }
          }
        }
      }
    })
  },

  onRosterPickerChange: function (e) {
    this.setData({ rosterIndex: e.detail.value });
  },
  onNameinput: function (e) {
    this.setData({ name: e.detail.value });
  },
  onBtnTap: function(e){
    if (this.data.name != null && this.data.name != "" && this.data.rosterIndex != null){
      wx.request({
        url: getApp().globalData.URL + "createCheckinbook",
        data: {
          'user':wx.getStorageSync('userid'),
          'roster':this.data.roster[this.data.rosterIndex].id,
          'name':this.data.name
        },
        success(resl){
          if(resl.data.code == 1){
            wx.redirectTo({
              url: '/pages/checkinbook/checkinbook?checkinbook='+resl.data.data,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请补充相关信息',
        icon: 'none'
      })
    }
  }
})