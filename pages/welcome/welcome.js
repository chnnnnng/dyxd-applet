// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animdata:null,
    currentPage:0,
    realname:'',
    isContinueDisabled:true,
    type:0, //0表示欢迎页，1表示只要完善信息,2表示从头播放，但是不可跳过
    linkCheckinsheet:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.action != undefined && options.action=="fill"){
      this.setData({type:1})
    }
    if (options.linkCheckinsheet != undefined) {
      this.setData({
        linkCheckinsheet: options.linkCheckinsheet,
        type:2
      })
    }
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
    if (this.data.type == 0 || this.data.type == 2){
      this.setData({ currentPage: 0 })
      let that = this
      setTimeout(function () {
        that.jumpToPage()
        setTimeout(function () {
          that.jumpToPage()
        }, 3000)
      }, 3000)
    }else{
      this.jumpToPage(2)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  jumpToPage(i=this.data.currentPage+1){
    let anim = wx.createAnimation({
      duration:800,
      timingFunction:'ease'
    })
    anim.top(-100*i+'vh').step()
    this.setData({
      animdata:anim.export(),
      currentPage:i
    })
  },
  onrealnameinput: function (e) {
    this.setData({
      realname: e.detail.value,
      isContinueDisabled: e.detail.value==''
    })
  },
  onContinue(){
    this.filldetail(this.data.realname)
  },
  onSkip(){
    this.filldetail("")
  },
  filldetail(realname) {
    let that = this
    var openid = wx.getStorageSync("openid");
    var cid = this.data.linkCheckinsheet
    wx.request({
      url: getApp().globalData.URL + "setUserDetail",
      data: {
        openid: openid,
        name: realname,
      },
      success(resl) {
        if (resl.data.code == 1) {
          wx.setStorageSync('userid', resl.data.data.id);
          wx.setStorageSync('phone', resl.data.data.phone);
          wx.setStorageSync('name', resl.data.data.name);
          that.jumpToPage()
          setTimeout(function(){
            if(that.data.type==0||that.data.type==2){
              wx.reLaunch({
                url: '/pages/index/index' + (cid == null ? '' : ('?linkCheckinsheet=' + cid))
              })
            }else{
              wx.navigateBack({
                
              })
            }
          },2000)
        }
      }
    });
  }
})