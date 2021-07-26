// pages/password/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    checkinsheetid: null,
    value: "",
    isFocus: true,
    itv: null,
    should_num: 0,
    actual_num: 0,
    actual_num_q: 0,
    cyclingPullInterval: 5000, //轮询时间间隔，5秒
    maxCyclingPullTimes: 60 //最多pull5分钟
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheetid: options.checkinsheet
    });
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getPasswordInfo",
      data: {
        checkinsheet: this.data.checkinsheetid
      },
      success(res) {
        if (res.data.code == 1) { //已设置口令
          that.setData({
            value: res.data.data.password,
            status: 1
          })
          that.startCyclingPull()
        } else {
          that.setData({
            value:"",
            status: 0
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onUnload:function(){
    clearInterval(this.data.itv)
  },
  onPasswordInput: function (e) {
    this.setData({
      value: e.detail.value
    })
    if (this.data.value.length == 4) {
      this.checkfill()
    }
  },
  onInputTap: function () {
    this.setData({
      isFocus: true
    })
  },
  onDoTap() {
    if (this.data.value.length==4) {
      wx.hideKeyboard()
      let that = this
      wx.request({
        url: getApp().globalData.URL + "setPassword",
        data: {
          password: that.data.value,
          checkinsheet: this.data.checkinsheetid
        },
        success(res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: '设置成功',
            })
            that.passwordSet()
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
  passwordSet() {
    this.setData({
      status: 1
    })
    this.startCyclingPull()
  },
  onCancelTap() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "deletePassword",
      data:{checkinsheet:this.data.checkinsheetid},
      success(res){
        if(res.data.code==1){
          that.setData({
            value:"",
            status: 0
          })
          that.onUnload()
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  //开始后定时从服务器获取签到人数信息
  startCyclingPull() {
    let that = this
    let maxTime = that.data.cyclingPullInterval / 1000 * that.data.maxCyclingPullTimes
    let itv = setInterval(function () {
      that.setData({ maxCyclingPullTimes: that.data.maxCyclingPullTimes - 1 })
      that.pullCheckinInfo()
      if (that.data.maxCyclingPullTimes <= 0) {
        clearInterval(itv)
        wx.showModal({
          title: '超时',
          content: '点名超时(' + maxTime + '秒)',
          showCancel: false
        })
        that.onCancelTap()
      }
    }, this.data.cyclingPullInterval)
    this.setData({
      itv: itv
    })
  },
  endCyclingPull() {
    clearInterval(this.data.itv)
  },
  pullCheckinInfo() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "pullCheckinInfo",
      data: {
        checkinsheet: this.data.checkinsheetid,
      },
      success(res) {
        that.setData({
          should_num: res.data.data.num_should,
          actual_num_q: res.data.data.num_actual
        })
        that.refreshDisplay()
      }
    })
  },
  refreshDisplay() {
    let d = this.data.actual_num_q - this.data.actual_num
    if (d > 0) {
      let that = this
      let itv = setInterval(function () {
        that.setData({
          actual_num: that.data.actual_num + 1
        })
        if (that.data.actual_num >= that.data.actual_num_q) {
          clearInterval(itv)
        }
      }, (this.data.cyclingPullInterval - 1000) / d)
    }
  },
  onRandTap(){
    let a = Math.floor(Math.random() * 10)
    let b = Math.floor(Math.random() * 10)
    let c = Math.floor(Math.random() * 10)
    let d = Math.floor(Math.random() * 10)
    this.setData({
      value:a+''+b+''+c+''+d
    })
  }
})