//index.js
//获取应用实例
const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    elements: [
      { title: '发现', url: '/pages/discovery/discovery', color: 'blue', icon: 'discover' ,show:'Discover'},
      { title: '创建 ', url: '/pages/create/create', color: 'orange', icon: 'creative', show: 'New'},
      { title: '扫码', url: '/pages/scan/scan', color: 'olive', icon: 'qrcode', show: 'Scan'},
      { title: '管理', url: '/pages/created/created', color: 'brown', icon: 'news', show: 'Manage'},
      { title: '口令', url: '/pages/password/password', color: 'mauve', icon: 'command', show: 'Password' },
      { title: '统计', url: '/packageB/pages/analysis/analysis', color: 'cyan', icon: 'rank', show: 'Analysis' },
      { title: '足迹', url: '/pages/history/history', color: 'pink', icon: 'footprint', show: 'Footprint'},
      { title: '信息', url: '/pages/mine/mine', color: 'grey', icon: 'profile', show: 'Profile'}
    ],
    animdata:null
  },

  onLoad: function (options) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().globalData.URL + 'login',
          data: { code: res.code },
          success(res) {
            //console.log(res.data);
            if (res.data.code == 10) {//初次登陆
              wx.setStorage({
                key: 'openid',
                data: res.data.data,
              });
              // wx.redirectTo({
              //   url: '/pages/fillinfo/fillinfo' + (options.linkCheckinsheet == undefined ? '' : ('?linkCheckinsheet=' + options.linkCheckinsheet))
              // });
              wx.redirectTo({
                url: '/pages/welcome/welcome' + (options.linkCheckinsheet == undefined ? '' : ('?linkCheckinsheet=' + options.linkCheckinsheet))
              })
            } else if (res.data.code == 1) {//登录成功
              wx.setStorageSync('userid', res.data.data.id);
              wx.setStorageSync('name', res.data.data.name);
              wx.setStorageSync('openid', res.data.data.openid);
              wx.setStorageSync('phone', res.data.data.phone);
              wx.setStorageSync('session_key', res.data.data.session_key);
              // wx.redirectTo({
              //   url: '/pages/checkin/f2f?checkinsheet=42',
              // })
              if(options.linkCheckinsheet != undefined){
                wx.navigateTo({
                  url: '/pages/link/checkin?checkinsheet='+options.linkCheckinsheet,
                })
              }
            } else {//失败
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
              wx.clearStorageSync()
            }
          }
        })
      }
    })
  },
  onReady(){
    let that = this
    setTimeout(function(){
      let anim1 = wx.createAnimation({
        duration: 1500,
        timingFunction: 'ease'
      })
      anim1.top(0).step()
      that.setData({ animdata: anim1.export() })
    },500)
    
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '分享|点一下到',
      path: '/page/index/index',
      imageUrl: '/static/imgs/sharecover.jpg'
    }
  },
})
