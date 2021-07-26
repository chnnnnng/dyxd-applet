Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkinsheetid:null,
    checkinsheet:null,
    checkinbook: null,
    roster: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ checkinsheetid: options.checkinsheet});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: { 'checkinsheet': that.data.checkinsheetid },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
        }
      }
    })
  },

  
  switchStatus: function(e){
    let t = this.data.checkinsheet;
    t.status = !t.status;
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "setCheckinsheetStatus",
      data: { 'checkinsheet': that.data.checkinsheetid,'status':t.status },
      success(resl) {
        if (resl.data.code == 1) {
          that.onShow()
          that.setData({ checkinsheet: t });
        }else{
          t.status = !t.status;
          that.setData({ checkinsheet: t });
          wx.showToast({
            title: resl.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  onRosterTap: function (e) {
    wx.navigateTo({
      url: '/pages/roster/roster?roster=' + this.data.roster.id,
    })
  },
  onCheckinbookTap: function (e) {
    wx.navigateTo({
      url: '/pages/checkinbook/checkinbook?checkinbook=' + this.data.checkinbook.id,
    })
  },
  //面对面快签
  onStartBTCTap:function(){
    wx.navigateTo({
      url: '/pages/expose/expose?checkinsheet=' + this.data.checkinsheetid
    })
  },
  //扫码
  onStartQRCCTap: function () {
    wx.navigateTo({
      url: '/pages/scan/set?checkinsheet=' + this.data.checkinsheetid
    })
  },
  //口令
  onStartPCTap: function () {
    wx.navigateTo({
      url: '/pages/password/set?checkinsheet=' + this.data.checkinsheetid
    })
  },
  //链接
  onStartLCTap: function () {
    wx.navigateTo({
      url: '/pages/link/link?checkinsheet=' + this.data.checkinsheetid
    })
  },
  //定位签
  onStartLCTCTap:function() {
    wx.navigateTo({
      url: '/pages/location/location?checkinsheet='+this.data.checkinsheetid
    })
  },
  //统计分析
  onAnalyseTap:function(){
    wx.navigateTo({
      url: '/packageB/pages/analysis/checkinsheet?checkinsheet=' + this.data.checkinsheetid
    })
  },
  //删除
  onDeleteTap: function () {
    let that = this;
    wx.showModal({
      title: '确认删除？',
      content: '删除后将不可恢复！',
      confirmColor: '#ff4040',
      success(resl) {
        if (resl.confirm) {
          wx.request({
            url: getApp().globalData.URL + "deleteCheckinsheet",
            data: {
              'checkinsheet': that.data.checkinsheet.id
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