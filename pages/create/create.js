// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInBook:true,
    bookPicker:[],
    bookIndex:null,
    rosterPicker: [],
    rosterIndex: null,
    name:null,
    roster:[],
    book:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: getApp().globalData.URL + "getBookAndRoster",
      data: {
        'user':wx.getStorageSync('userid')
      },
      success(resl){
        if(resl.data.code){
          var t1 = [],t2 = [];
          if (resl.data.data.roster.length == 0){
            wx.showModal({
              title: '提示',
              content: '尚未创建任何花名册，先创建一个吧',
              confirmText:"去创建",
              showCancel:false,
              success(res){
                wx.redirectTo({
                  url: '/pages/createRoster/createRoster',
                })
              }
            })
          }else{
            for (let i in resl.data.data.roster) {
              t1[i] = resl.data.data.roster[i].name;
            }
            for (let i in resl.data.data.book) {
              t2[i] = resl.data.data.book[i].name;
            }
            that.setData({
              roster: resl.data.data.roster,
              book: resl.data.data.book,
              rosterPicker: t1,
              bookPicker: t2
            })
          }
        }
        if (options.checkinbook != undefined) {
          for (let i in that.data.book) {
            if (that.data.book[i].id == options.checkinbook) {
              that.setData({
                isInBook: true,
                bookIndex: i
              });
              break;
            }
          }
        }
        if(options.roster != undefined){
          for(let i in that.data.roster){
            if(that.data.roster[i].id == options.roster){
              that.setData({
                isInBook: false,
                rosterIndex: i
              })
              break;
            }
          }
        }
      }
    })
  },

 

  onSwitchChange : function(e){
    this.setData({ isInBook: !this.data.isInBook})
  },
  onBookPickerChange : function(e){
    this.setData({ bookIndex:e.detail.value });
  },
  onRosterPickerChange: function (e) {
    this.setData({ rosterIndex: e.detail.value });
  },
  onNameinput : function(e){
    this.setData({ name:e.detail.value });
  },
  onBtnTap : function(e){
    if (this.data.isInBook && this.data.bookIndex != null && this.data.name != null && this.data.name != ""){
      wx.request({
        url: getApp().globalData.URL + "createCheckinSheet",
        data: {
          'isInBook':true,
          'user':wx.getStorageSync('userid'),
          'name':this.data.name,
          'book':this.data.book[this.data.bookIndex].id
        },
        success(resl){
          if (resl.data.code == 1) {
            wx.redirectTo({
              url: '/pages/checkinsheet/checkinsheet?checkinsheet=' + resl.data.data.id,
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
          }
        }
      })
    }
    else if (!this.data.isInBook && this.data.rosterIndex != null && this.data.name != null && this.data.name != ""){
      wx.request({
        url: getApp().globalData.URL + "createCheckinSheet",
        data: {
          'isInBook':false,
          'user': wx.getStorageSync('userid'),
          'name': this.data.name,
          'roster': this.data.roster[this.data.rosterIndex].id
        },
        success(resl) {
          if(resl.data.code==1){
            wx.redirectTo({
              url: '/pages/checkinsheet/checkinsheet?checkinsheet=' + resl.data.data.id,
            })
          }else{
            wx.showToast({
              title: '操作失败',
              icon:'none'
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