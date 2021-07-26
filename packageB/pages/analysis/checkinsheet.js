// pages/analysis/checkinsheet.js
import * as echarts from '../../utils/ec-canvas/echarts';
var chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    checkinsheetid: null,
    checkinsheet: null,
    checkinitems: [],
    only: -1, //筛选,-1表示不筛选
    showModal: false,
    selectedItemIndex: null,
    selectedBtn: null,
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinsheetid: options.checkinsheet
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        'checkinsheet': that.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
          setTimeout(function() {
            that.freshChart();
          }, 800);
        }
      }
    })
    wx.request({
      url: getApp().globalData.URL + "getCheckinitems",
      data: {
        checkinsheet: this.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({
            checkinitems: resl.data.data
          })
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      }
    })
  },
  onOnlyAbsentTap: function() {
    this.setData({
      only: 3
    })
  },
  onOnlyAttendTap: function() {
    this.setData({
      only: 1
    })
  },
  onOnlyLeaveTap: function() {
    this.setData({
      only: 2
    })
  },
  onAllShowTap: function() {
    this.setData({
      only: -1
    })
  },
  onCheckinitemTap: function(e) {
    console.log(e);
    this.setData({
      showModal: true,
      selectedItemIndex: e.currentTarget.dataset.i
    })
  },
  hideModal: function() {
    this.setData({
      showModal: false,
      selectedBtn: null,
      selectedItemIndex: null
    })
  },
  onSetTap: function(e) {
    this.setData({
      selectedBtn: e.currentTarget.dataset.type
    })
  },
  onEditTap: function(e) {
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "setCheckinitemStatus",
      data: {
        checkinitem: this.data.checkinitems[this.data.selectedItemIndex].id,
        status: this.data.selectedBtn
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.hideModal();
          that.freshData();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
          that.hideModal()
        }
      }
    })
  },
  tabSelect: function(e) {
    let that = this;
    this.setData({
      TabCur: e.target.dataset.id
    })
    if (e.target.dataset.id == 0) {
      setTimeout(function() {
        that.freshChart()
      }, 300)
    }
  },
  freshData: function() {
    let that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinsheet",
      data: {
        'checkinsheet': that.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
        }
      }
    })
    wx.request({
      url: getApp().globalData.URL + "getCheckinitems",
      data: {
        checkinsheet: this.data.checkinsheetid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData({
            checkinitems: resl.data.data
          })
        }
      }
    })
  },
  freshChart: function() {
    chart.setOption({
      toolbox: {
        feature: {}
      },
      series: [{
        name: '出勤率',
        type: 'gauge',
        radius: '95%', //仪表盘半径
        center: ['50%', '65%'], //仪表盘位置
        detail: {
          formatter: '{value}%'
        },
        data: [{
          value: Math.round((this.data.checkinsheet.num_actual + this.data.checkinsheet.num_leave) / this.data.checkinsheet.num_should * 100),
          name: '出勤率'
        }],
        startAngle: 208, //起始角度
        endAngle: -28,
        axisLine: {
          lineStyle: { //仪表盘轴线相关配置。
            width: 50,
            color: [
              [0.33, '#ff7073'],
              [0.66, '#ffcf00'],
              [1, '#4fb3a4']
            ]
          }
        },
        splitLine: { //分隔线样式相关
          length: 40, //分割线的长度
          lineStyle: {
            width: 3,
            color: '#ffffff'
          }
        },
        axisLabel: { //大刻度标签。
          distance: -70, //数字刻度距离
          textStyle: { //数字刻度样式
            color: '#7c8489',
            fontSize: 18,
          }
        },
        axisTick: { //小刻度相关
          show: false
        }
      }]
    });
  }
})