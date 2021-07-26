// pages/discovery/discovery.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    long:null,
    lat:null,
    isEmpty:true,
    checkins:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '正在搜索附近…',
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:true,
      highAccuracyExpireTime:5000,
      success: function(res) {
        that.setData({
          long:res.longitude,
          lat:res.latitude
        })
        wx.hideLoading()
        that.onShow()
      },
    })
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.long != null && this.data.lat != null) {
      let that = this;
      wx.request({
        url: getApp().globalData.URL + "discover",
        data: {
          latitude: Math.round(this.data.lat * 1000000),
          longitude: Math.round(this.data.long * 1000000),
        },
        success(res) {
          //console.log(res)
          if (res.data.code) {
            if(res.data.data.length == 0){
              that.setData({isEmpty:true});
              wx.showToast({
                title: "本来无一物，何处惹尘埃",
                icon: 'none'
              })
            }else{
              that.setData({ checkins: res.data.data.reverse() ,isEmpty:false})
            }
            
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },


  onTap(e){
    if (e.currentTarget.dataset.type == 1) {//location
      wx.redirectTo({
        url: '/pages/checkin/location?checkinsheet=' + e.currentTarget.dataset.checkinsheet,
      })
    } else {//f2f
      wx.redirectTo({
        url: '/pages/checkin/f2f?checkinsheet=' + e.currentTarget.dataset.checkinsheet,
      })
    }
  }
})