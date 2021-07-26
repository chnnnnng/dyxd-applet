// pages/checkin/f2f.js
import {
  F2fu
} from '../../utils/f2fu/f2fu.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: true,
    ic: '',
    checkinsheetid: null,
    checkinsheet: null,
    checkinbook: null,
    roster: null,
    targetWifilist: null,
    nativeWifilist: null,
    additionWifilist:null,
    minRate: 0.3, //最小重合率
    animdata:null,
    animdata2: null,
    animdata3: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheetid: options.checkinsheet
    });
    let that = this
    wx.showLoading({
      title: '正在验证',
    })
  setTimeout(function(){
    that.varify()
  },3000)
  },
  //验证环境
  varify() { //获取目标环境信息
    
    let that = this
    wx.request({
      url: getApp().globalData.URL + "pullWifilist",
      data: {
        'checkinsheet': that.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({
            targetWifilist: F2fu.formateServerData(resl.data.data)
          });
          that.getNativeWifilist()
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '失败',
            content: '获取验证信息失败',
            showCancel:false
          })
        }
      }
    })
  },
  //获取本地wifi信息
  getNativeWifilist() {
    let that = this
    wx.startWifi({ //初始化wifi
      success: function(res) {
        wx.getWifiList({ //成功后，就可以获取列表了
          success: function(res) {
            //列表获取成功后，要到事件里提取
            wx.onGetWifiList(function(res) {
              that.setData({
                nativeWifilist: F2fu.formateLocalData(res.wifiList)
              })
              //console.log(that.data.wifilist)
              that.compare()
            })
          }
        });
      }
    });
  },
  //比较信息
  compare() {
    let u = new F2fu(this.data.targetWifilist, this.data.nativeWifilist)
    if (u.calcJSC() >= this.data.minRate) { //验证成功
      this.setData({ additionWifilist: u.getAddition()})
      this.startCheckin()
    } else { //验证失败
    wx.hideLoading()
      wx.showModal({
        title: '验证失败',
        content: '请确保您在签到现场,并且打开了GPS和WIFI',
        showCancel: false
      })
      wx.navigateBack({

      })
    }
  },
  //开始签到
  startCheckin() {
    this.pullCheckinsheetInfo()
  },
  pullCheckinsheetInfo(){
    var that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        'checkinsheet': that.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
          that.pullIdentity()
        }
      }
    })
  },
  pullIdentity(){
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getIdentitycode",
      data: {
        'checkinsheet': that.data.checkinsheetid,
        'user': wx.getStorageSync('userid')
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({
            ic: resl.data.data
          });
        } else {
          that.setData({
            isDisabled: false
          });
        }
        wx.hideLoading()
        wx.showToast({
          title: '验证成功',
          duration:800
        })
        setTimeout(function(){
          that.showForm()
        },800)
      }
    })
  },
  showForm(){
    let a = wx.createAnimation({
      duration:500,
      timingFunction:'ease'
    })
    a.top(0).step()
    this.setData({animdata:a.export()})
  },
  onInput(e) {
    this.setData({
      ic: e.detail.value
    })
  },
  onCheck(e) {
    if (wx.getStorageSync('name') == "") {
      wx.navigateTo({
        url: '/pages/welcome/welcome?action=fill',
      })
    } else {
      if (this.data.ic != '') {
        let that = this
        wx.request({
          url: getApp().globalData.URL + "putCheckin",
          data: {
            'checkinsheet': this.data.checkinsheetid,
            'user': wx.getStorageSync('userid'),
            'identity_code': this.data.ic
          },
          success(resl) {
            if (resl.data.code == 1) {
              let t = that.data.checkinsheet
              t.num_actual++
              that.setData({
                checkinsheet: t
              })
              wx.vibrateLong({

              })
              wx.showToast({
                title: '签到成功',
                duration: 5000
              })
              that.pushAdditionWifilist()
            } else {
              wx.showToast({
                title: resl.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    }
    
  },
  pushAdditionWifilist(){
    console.log(this.data.additionWifilist)
    console.log(this.data.additionWifilist.length)
    if(this.data.additionWifilist.length>0){
      let that = this
      wx.request({
        url: getApp().globalData.URL + "pushWifilist",
        data: {
          user: wx.getStorageSync('userid'),
          checkinsheet: this.data.checkinsheetid,
          wifilist: this.data.additionWifilist,
          type: true
        },
        success(res) {
          console.log("补充成功");
        }
      })
    }
    }
})