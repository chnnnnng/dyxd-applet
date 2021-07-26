// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty:true,
    checkins:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "getHistory",
      data:{'user':wx.getStorageSync('userid')},
      success(res){
        if(res.data.code==1){
          if(res.data.data.length==0){
            that.setData({isEmpty:true})
            wx.showToast({
              title: '本来无一物，何处惹尘埃',
              icon: 'none'
            })
          }else{
            res.data.data.reverse()
            for(let i in res.data.data){
              var t = res.data.data[i].checkinitem_time
              var d = new Date(t)
              res.data.data[i].checkinitem_time = d.getFullYear() + "年" + d.getMonth() + "月" + d.getDate() + "日 " + d.getHours() + ":" + (d.getMinutes() < 10 ? ('0' + d.getMinutes()): d.getMinutes())
            }
            that.setData({ isEmpty: false ,checkins:res.data.data})
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },

})