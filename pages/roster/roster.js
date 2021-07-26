// pages/roster/roster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rosterid:null,
    info:null,
    roster:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ rosterid: options.roster});
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
      url: getApp().globalData.URL + "getRoster",
      data: { 'roster':  this.data.rosterid},
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
        }
      }
    })
  },

  onDeleteTap:function(){
    let that = this;
    wx.showModal({
      title: '确认删除？',
      content: '所有使用该花名册的项目将一并删除，且不可恢复！',
      confirmColor: '#ff4040',
      success(resl){
        if(resl.confirm){
          wx.request({
            url: getApp().globalData.URL + "deleteRoster",
            data: {
              'roster':that.data.info.id
            },
            success(resl){
              if(resl.data.code==0){
                wx.showToast({
                  title: resl.data.msg,
                  icon:'none'
                })
              }else if(resl.data.code==1){
                wx.navigateBack({
                  
                })
              }
            }
          })
        }else{

        }
      }
    })
  },
  onCreateCheckinsheetTap(){
    wx.redirectTo({
      url: '/pages/create/create?roster=' + this.data.rosterid,
    })
  },
  onCreateCheckinbookTap(){
    wx.redirectTo({
      url: '/pages/createCheckinbook/createCheckinbook?roster='+this.data.rosterid,
    })
  }
})