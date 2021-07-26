// pages/createRoster/createRoster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roster:[],
    number:0,
    name:"",
    show:false,
    raw:"",
  },


  onNameinput: function (e) {
    this.setData({ name: e.detail.value });
  },
  showModal:function(e){
    this.setData({show:true});
  },
  hideModal:function(e){
    this.setData({show:false});
  },
  textareaInput:function(e){
    this.setData({raw:e.detail.value});
  },
  onImportTap:function(e){
    let m = this.data.raw.split('\n');
    for(let i=0;i<m.length;i++){ //去除空元素
      m[i] = m[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      if(m[i].length==0){
        m.splice(i,1);
        i--;
      }
    }
    for(let i = 0;i<m.length;i++){//去除重复元素
      if(m.indexOf(m[i])!=i){
        m.splice(i,1)
        i--;
      }
    }
    this.setData({
      roster:m,
      number:m.length,
      raw:m.join('\n')
    })
    this.hideModal();
  },
  onBtnTap: function(){
    if(this.data.name != "" && this.data.number>0){
      wx.request({
        url: getApp().globalData.URL + "createRoster",
        data:{
          'user':wx.getStorageSync('userid'),
          'name':this.data.name,
          'roster':JSON.stringify(this.data.roster),
        },
        success(resl){
          if(resl.data.code==1){
            wx.redirectTo({
              url: '/pages/created/created?tab=roster',
            })
          }else{
            wx.showToast({
              title: '失败',
              icon:'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请填写花名册名称并导入成员',
        icon: 'none'
      })
    }
  }
})