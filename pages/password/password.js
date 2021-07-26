// pages/password/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    isFocus: true,
    num: 0,
    numList: [{
      name: '开始'
    }, {
      name: '输入口令'
    }, {
      name: '确认身份'
    }, {
      name: '签到完成'
    }, ],
    checkinsheet: {},
    isDisabled: true,
    ic: null,
    showCancel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  onPasswordInput: function(e) {
    this.setData({
      value:e.detail.value
    })
    if(this.data.value.length==4){
      this.checkfill()
    }
  },
  onInputTap:function(){
    this.setData({
      isFocus:true
    })
  },
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  checkfill() {
    if (this.data.value.length==4) {
      wx.hideKeyboard()
      let that = this
      wx.request({
        url: getApp().globalData.URL + "getPasswordInfo",
        data: {
          password: that.data.value
        },
        success(res) {
          if (res.data.code == 1) {
            that.setData({
              checkinsheet: res.data.data
            })
            that.numSteps()
            that.confirmIdentity()
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
  confirmIdentity() {
    let that = this
    wx.request({
      url: getApp().globalData.URL + "getIdentitycode",
      data: {
        'checkinsheet': that.data.checkinsheet.id,
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
      }
    })
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
            'checkinsheet': this.data.checkinsheet.id,
            'user': wx.getStorageSync('userid'),
            'identity_code': this.data.ic
          },
          success(resl) {
            if (resl.data.code == 1) {
              that.numSteps()
              setTimeout(function() {
                that.numSteps()
                wx.vibrateLong({

                })
                wx.showToast({
                  title: '签到成功',
                  duration: 3000
                })
              }, 1500)

            } else {
              wx.showToast({
                title: resl.data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
      }
    }
  }
})