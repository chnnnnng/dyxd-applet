// pages/expose/expose.js
import {
  F2fu
} from '../../utils/f2fu/f2fu.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkinsheetid: null,
    checkinsheet: null,
    animdata: null,
    animdata2: null,
    animdata3: null,
    status: 0,
    wifilist: [],
    long: null,
    lat: null,
    isOK: false,
    endTouchStartTime: null,
    itv: null,
    actual_num: null,
    actual_num_q: null,
    cyclingPullInterval: 5000, //轮询时间间隔，5秒
    maxCyclingPullTimes: 60 //最多pull5分钟
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.checkinsheet != undefined) this.setData({
      checkinsheetid: options.checkinsheet
    });
    //检测上次是否异常退出，如果是则结束
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getF2fInfo",
      data: {
        checkinsheet: this.data.checkinsheetid,
      },
      success(res) {
        that.setData({
          checkinsheet: res.data.data,
          actual_num: res.data.data.num_actual,
          actual_num_q: res.data.data.num_actual
        })
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 5000
          })
          setTimeout(function() {
            that.getNativeInfo()
          }, 5000)
        } else {
          that.getNativeInfo()
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.status == 1) {
      let that = this
      wx.request({
        url: getApp().globalData.URL + "stopF2f",
        data: {
          checkinsheet: this.data.checkinsheet.id,
        },
        success(res) {
          that.endCyclingPull()
        }
      })
    }
  },
  //开始获取本机信息（包括wifi和定位）
  getNativeInfo() {
    wx.showLoading({
      title: '正在分析环境',
    })
    this.getWifilist()
  },
  //获取本机wifilist
  getWifilist() {
    let that = this
    wx.startWifi({ //初始化wifi
      success: function(res) {
        wx.getWifiList({ //成功后，就可以获取列表了
          success: function(res) {
            //列表获取成功后，要到事件里提取
            wx.onGetWifiList(function(res) {
              that.setData({
                wifilist: F2fu.formateLocalData(res.wifiList)
              })
              //console.log(that.data.wifilist)
              that.getLocation()
            })
          }
        });
      }
    });
  },
  //获取本机定位
  getLocation() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 5000,
      success: function(res) {
        that.setData({
          long: res.longitude,
          lat: res.latitude,
          isOk: true
        })
        wx.hideLoading();
        wx.showToast({
          title: '分析成功',
          duration: 800
        })
        setTimeout(function() {
          that.showStartBtn()
        }, 800)
      },
    })
  },
  //显示开始按钮
  showStartBtn() {
    let a = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    a.translateY("-1000rpx").step()
    this.setData({
      animdata: a.export()
    })
    a.translateY("500rpx").step()
    this.setData({
      animdata2: a.export()
    })
  },
  //点击开始点名
  onStartTap: function() {
    let that = this
    wx.showLoading({
      title: '正在推送…',
    })
    setTimeout(function() {
      that.saveLocation()
    }, 500)
  },
  //向服务器注册位置
  saveLocation() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "exposeLocation",
      data: {
        latitude: Math.round(this.data.lat * 1000000),
        longitude: Math.round(this.data.long * 1000000),
        radius: 100,
        checkinsheet: this.data.checkinsheet.id,
        type: 0
      },
      success(res) {
        if (res.data.code) {
          that.saveWifilist()
        } else {
          wx.showToast({
            title: "发送位置信息失败",
            icon: 'none'
          })
        }
      }
    })
  },
  //向服务器注册Wi-Fi信息
  saveWifilist() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "pushWifilist",
      data: {
        user: wx.getStorageSync('userid'),
        checkinsheet: this.data.checkinsheet.id,
        wifilist: this.data.wifilist,
      },
      success(res) {
        if (res.data.code) {
          that.onStart()
        } else {
          wx.showToast({
            title: "发送Wi-Fi信息失败",
            icon: 'none'
          })
        }
      }
    })
  },
  //发送信息完成，正式开始
  onStart() {
    let that = this
    wx.hideLoading()
    this.setData({
      status: 1
    })
    wx.showToast({
      title: '开始点名',
      duration: 500
    })
    wx.vibrateLong({

    })
    setTimeout(function() {
      that.switch2EndBtn()
    }, 500)
    this.startCyclingPull()
  },
  onStop() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "stopF2f",
      data: {
        checkinsheet: this.data.checkinsheet.id,
      },
      success(res) {
        that.setData({
          status: 0
        })
        that.endCyclingPull()
        setTimeout(function() {
          wx.navigateBack({

          })
        }, 500)
      }
    })
  },
  switch2EndBtn() {
    let a = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    a.translateY("-3000rpx").step()
    this.setData({
      animdata: a.export()
    })
    let b = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    b.top("60vh").step()
    this.setData({
      animdata3: b.export()
    })
  },
  onEndStart(e) {
    this.setData({
      endTouchStartTime: e.timeStamp
    })
    let a = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease'
    })
    a.scale(0.38).opacity(0.62).step()
    this.setData({
      animdata3: a.export()
    })
  },
  onEndCancel(e) {
    let d = e.timeStamp - this.data.endTouchStartTime
    if (d < 2000) {
      let a = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      })
      a.height("260rpx").width("260rpx").opacity(1).step()
      this.setData({
        animdata3: a.export()
      })
    } else {
      let a = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      })
      a.opacity(0).step()
      this.setData({
        animdata3: a.export()
      })
      wx.vibrateLong({

      })
      this.onStop()
    }
  },
  //开始后定时从服务器获取签到人数信息
  startCyclingPull() {
    let that = this
    let maxTime = that.data.cyclingPullInterval / 1000 * that.data.maxCyclingPullTimes
    let itv = setInterval(function() {
      that.setData({ maxCyclingPullTimes: that.data.maxCyclingPullTimes - 1 })
      that.pullCheckinInfo()
      if(that.data.maxCyclingPullTimes<=0){
        clearInterval(itv)
        wx.showModal({
          title: '超时',
          content: '面对面点名超时(' + maxTime + '秒)',
          showCancel:false
        })
        that.onStop()
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
        checkinsheet: this.data.checkinsheet.id,
      },
      success(res) {
        that.setData({
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
      let itv = setInterval(function() {
        that.setData({
          actual_num: that.data.actual_num + 1
        })
        if (that.data.actual_num >= that.data.actual_num_q) {
          clearInterval(itv)
        }
      }, (this.data.cyclingPullInterval - 1000)/d)
    }
  }
})