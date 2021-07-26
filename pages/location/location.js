// pages/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkinsheetid:null,
    checkinsheet:null,
    isOk:false,
    long:0,
    lat:0,
    markers: [],
    circles:[],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    aniData:{},
    aniData2:{},
    status:0,
    itv: null,
    should_num:0,
    actual_num: 0,
    actual_num_q: 0,
    cyclingPullInterval: 5000, //轮询时间间隔，5秒
    maxCyclingPullTimes: 60 //最多pull5分钟
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.checkinsheet != undefined) this.setData({checkinsheetid:options.checkinsheet});
    wx.showLoading({
      title: '正在定位',
    });
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "getLocation",
      data: {
        checkinsheet: this.data.checkinsheetid
      },
      success(res) {
        if (res.data.code) { //己经开始
          that.setData({
            long: res.data.data.longitude/1000000,
            lat: res.data.data.latitude/1000000,
            isOk: true,
          })
          wx.hideLoading();
          that.setMarker(res.data.data.latitude/1000000, res.data.data.longitude/1000000, res.data.data.radius)
          that.locationExposed()
        } else { //还未开始
          wx.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,
            highAccuracyExpireTime: 5000,
            success: function (res) {
              that.setData({
                long: res.longitude,
                lat: res.latitude,
                isOk: true,
              })
              wx.hideLoading();
              that.setMarker(res.latitude, res.longitude)
            },
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.itv)
  },

 
  onmaptap(e){
    this.setMarker(e.detail.latitude,e.detail.longitude);
  },
  radius_m(){
    let t = this.data.circles;
    t[0].radius -= 10;
    if(t[0].radius<25)t[0].radius=25;
    this.setData({circles:t});
  },
  radius_a(){
    let t = this.data.circles;
    t[0].radius += 10;
    if (t[0].radius > 1500) t[0].radius = 1500;
    this.setData({ circles: t });
  },
  start(){
    if(this.data.isOk && this.data.checkinsheetid!=null){
      let that = this;
      wx.request({
        url: getApp().globalData.URL + "exposeLocation",
        data:{
          latitude: Math.round(this.data.lat * 1000000),
          longitude: Math.round(this.data.long * 1000000),
          radius:this.data.circles[0].radius,
          checkinsheet:this.data.checkinsheetid
        },
        success(res){
          if (res.data.code) {
            that.locationExposed()
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
  end(){
    this.free()
    let a = wx.createAnimation({
      duration: 1200,
      timingFunction: 'ease'
    })
    a.translateY('0vh').step()
    let b = wx.createAnimation({
      duration: 1200,
      timingFunction: 'ease'
    })
    b.top('100vh').step()
    this.setData({ aniData: a.export(),aniData2:b.export()})
    var that = this
    setTimeout(function () {
      that.setData({ status: 0 })
    }, 1200)
  },
  setMarker(lat,long,radius=50){ //radius为半径，单位是米
    this.setData({
      markers: [{
        iconPath: "/static/imgs/icon-location.png",
        id: 0,
        latitude: lat,
        longitude: long,
        width: 50,
        height: 50
      }],
      circles:[{
        latitude: lat,
        longitude: long,
        radius:radius,
        color:"#5786f1",
        fillColor:"#5786f120",
        strokeWidth:2
      }]
    })
  },
  locationExposed(){
    this.startCyclingPull();
    wx.showToast({
      title: '开始签到',
    })
    let a = wx.createAnimation({
      duration: 1200,
      timingFunction: 'ease'
    })
    a.translateY('-30vh').step()
    let b = wx.createAnimation({
      duration: 1200,
      timingFunction: 'ease'
    })
    b.top('70vh').step()
    this.setData({aniData:a.export(),aniData2:b.export()})
    var that=this
    setTimeout(function(){
      that.setData({ status: 1})
    },1200)
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
          content: '定位点名超时(' + maxTime + '秒)',
          showCancel:false
        })
        that.end()
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
          should_num:res.data.data.num_should,
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
  free(){
    clearInterval(this.data.itv)
    wx.request({
      url: getApp().globalData.URL + "unexposeLocation",
      data: {
        checkinsheetid: this.data.checkinsheetid
      }
    })
  }
})