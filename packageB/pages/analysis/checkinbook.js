// pages/analysis/checkinbook.js
import * as echarts from '../../utils/ec-canvas/echarts';
var chart1 = null;
var chart2 = null;
var chart3 = null;

function getOption1(num_actual = 1, num_leave = 1, num_absent = 1) {
  return {
    backgroundColor: '#ffffff',

    title: {
      text: '总计',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#2c333b'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },

    visualMap: {
      show: false,
      min: (num_actual < num_leave ? (num_actual < num_absent ? num_actual : num_absent) : (num_leave < num_absent ? num_leave : num_absent)),
      max: (num_actual > num_leave ? (num_actual > num_absent ? num_actual : num_absent) : (num_leave > num_absent ? num_leave : num_absent)),
      inRange: {
        colorLightness: [0.7, 0.5]
      }
    },
    series: [{
      name: '状态',
      type: 'pie',
      radius: '60%',
      center: ['50%', '60%'],
      data: [{
          value: num_actual,
          name: '出勤'
        },
        {
          value: num_leave,
          name: '请假'
        },
        {
          value: num_absent,
          name: '缺勤'
        },
      ].sort(function(a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
        color: 'rgba(0, 0, 0, 0.5)'
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.5)'
        },
        smooth: 0.2,
        length: 10,
        length2: 20
      },
      itemStyle: {
        color: '#2e98ff',
        shadowBlur: 200,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function(idx) {
        return Math.random() * 200;
      }
    }]
  };
}

function getOption2(sheetnames = ['点名表名称'], actualDatas = [10], leaveDatas = [10], absentDatas = [10]) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['出勤', '请假', '缺勤'],
      top: 0
    },
    grid: {
      left: 60,
      right: 0,
      bottom: 60,
      top: 20,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.38)'
        }
      },
    },
    yAxis: {
      type: 'category',
      data: sheetnames,
      z: 999,
      axisLabel: {
        fontSize: 15,
        inside: true,
        margin: -50,
        align: 'left',
        color: 'rgba(0, 0, 0, 0.38)'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.38)'
        }
      },
    },
    series: [{
        name: '出勤',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: actualDatas
      },
      {
        name: '请假',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: leaveDatas
      },
      {
        name: '缺勤',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: absentDatas
      }
    ],
    color: ['#c6f66f', '#5ec4cd', '#ff7a73']
  };
}

function getOption3(userlist = ['未知'], actualDatas = [10], leaveDatas = [10], absentDatas = [10]) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['出勤', '请假', '缺勤'],
      top: 0
    },
    grid: {
      left: 60,
      right: 0,
      bottom: 60,
      top: 20,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.38)'
        }
      },
    },
    yAxis: {
      type: 'category',
      data: userlist,
      z: 999,
      axisLabel: {
        fontSize: 14,
        inside: true,
        margin: -50,
        align: 'left',
        color: 'rgba(0, 0, 0, 0.38)'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.38)'
        }
      },
    },
    series: [{
        name: '出勤',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: actualDatas
      },
      {
        name: '请假',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: leaveDatas
      },
      {
        name: '缺勤',
        type: 'bar',
        stack: '总量',
        label: {
          show: false,
          position: 'inside'
        },
        data: absentDatas
      }
    ],
    color: ['#c6f66f', '#5ec4cd', '#ff7a73']
  };
}

function initChart1(canvas, width, height) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart1);
  chart1.setOption(getOption1());
  return chart1;
}

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart2);
  chart2.setOption(getOption2());
  return chart2;
}

function initChart3(canvas, width, height) {
  chart3 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart3);
  chart3.setOption(getOption3());
  return chart3;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkinbookid: null,
    checkinbook: null,
    checkinsheet: [],
    TabCur: 0,
    ec1: {
      onInit: initChart1
    },
    ec2: {
      onInit: initChart2
    },
    ec3: {
      onInit: initChart3
    },
    total_should_num: 0,
    total_actual_num: 0,
    total_leave_num: 0,
    total_absent_num: 0,
    total_actual_rate: 0,
    total_leave_tare: 0,
    total_absent_rate: 0,
    total_sheet: 0,
    sheet_names: [],
    sheet_actuals: [],
    sheet_leaves: [],
    sheet_absents: [],
    users: [],
    selectedSort: 3,
    height2set:100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checkinbookid: options.checkinbook
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.URL + "getCheckinbookData",
      data: {
        'checkinbook': this.data.checkinbookid
      },
      success(resl) {
        if (resl.data.code == 1) {
          that.setData(resl.data.data);
          that.calcSummary()
          that.calcSheet()
          that.calcUser()
          setTimeout(function() {
            that.showSummary()
          }, 500)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  tabSelect: function(e) {
    this.setData({
      TabCur: e.target.dataset.id
    })
    if (e.target.dataset.id == 0) {
      setTimeout(this.showSummary, 300)
    } else if (e.target.dataset.id == 1) {
      setTimeout(this.showSheet, 300)
    } else {
      setTimeout(this.showUSer, 300)
    }
  },

  calcSummary() {
    let tsn = 0,
      tan = 0,
      tln = 0,
      tbn = 0,
      tar = 0,
      tlr = 0,
      tbr = 0;
    for (let i in this.data.checkinsheet) {
      tsn += this.data.checkinsheet[i].num_should
      tan += this.data.checkinsheet[i].num_actual
      tln += this.data.checkinsheet[i].num_leave
      tbn += this.data.checkinsheet[i].num_absent
    }
    tar = Math.round(tan / tsn * 10000) / 100
    tlr = Math.round(tln / tsn * 10000) / 100
    tbr = Math.round(tbn / tsn * 10000) / 100
    this.setData({
      total_should_num: tsn,
      total_actual_num: tan,
      total_leave_num: tln,
      total_absent_num: tbn,
      total_actual_rate: tar,
      total_leave_tare: tlr,
      total_absent_rate: tbr,
      total_sheet: this.data.checkinsheet.length
    })
  },
  showSummary() {
    chart1.setOption(getOption1(this.data.total_actual_num, this.data.total_leave_num, this.data.total_absent_num))
  },
  calcSheet() {
    var names = [],
      d1 = [],
      d2 = [],
      d3 = [];
    for (let i in this.data.checkinsheet) {
      names.push(this.data.checkinsheet[i].name)
      d1.push(this.data.checkinsheet[i].num_actual)
      d2.push(this.data.checkinsheet[i].num_leave)
      d3.push(this.data.checkinsheet[i].num_absent)
    }
    this.setData({
      sheet_names: names,
      sheet_actuals: d1,
      sheet_leaves: d2,
      sheet_absents: d3,
    })
  },
  showSheet() {
    chart2.setOption(getOption2(this.data.sheet_names, this.data.sheet_actuals, this.data.sheet_leaves, this.data.sheet_absents))
  },
  calcUser() {
    var users = []
    var identity_user_map = {}
    for (let i in this.data.roster.data) {
      users[i] = {
        'name': null,
        'num_should': 0,
        'num_actual': 0,
        'num_leave': 0,
        'num_absent': 0,
        'checkinitems': [],
        'identity_code': this.data.roster.data[i]
      }
      identity_user_map[this.data.roster.data[i]] = i
    }
    for (let i in this.data.checkinsheet) {
      for (let j in this.data.checkinsheet[i].checkinitems) {
        if (users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].name == null) {
          users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].name = this.data.checkinsheet[i].checkinitems[j].user
        }
        if (this.data.checkinsheet[i].checkinitems[j].status == 1) {
          users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].num_actual += 1
        }
        if (this.data.checkinsheet[i].checkinitems[j].status == 2) {
          users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].num_leave += 1
        }
        if (this.data.checkinsheet[i].checkinitems[j].status == 3) {
          users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].num_absent += 1
        }
        users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].num_should += 1
        users[identity_user_map[this.data.checkinsheet[i].checkinitems[j].identity_code]].checkinitems.push(this.data.checkinsheet[i].checkinitems[j])
      }
    }
    users.sort(function (a, b) {
      return a.num_absent - b.num_absent
    })
    this.setData({
      users: users,
    })
  },
  showUSer() {
    var userlist = [],
      actuals = [],
      leaves = [],
      absents = []
    for (let i in this.data.users) {
      if (this.data.users[i] != null) {
        actuals.push(this.data.users[i].num_actual)
        userlist.push((this.data.users[i].name == null ? "未知" : this.data.users[i].name) + "(" + this.data.users[i].identity_code + ")")
        leaves.push(this.data.users[i].num_leave)
        absents.push(this.data.users[i].num_absent)
      }
    }
    this.setData({ height2set: (userlist.length * 3.5 < 70 ? 70 : userlist.length * 3.5) })
    chart3.setOption(getOption3(userlist.reverse(), actuals.reverse(), leaves.reverse(), absents.reverse()))
    const query = wx.createSelectorQuery()// 创建节点查询器 query
    query.select('#chart3-div').boundingClientRect(function(res){
      chart3.resize({ width: res.width, height: res.height })
    }).exec()  
    
  },
  sortByAttend() {
    let users = this.data.users
    console.log(users)
    users.sort(function(a, b) {
      return b.num_actual - a.num_actual
    })
    this.setData({
      users: users,
      selectedSort: 0
    })
    this.showUSer()
  },
  sortByLeave() {
    let users = this.data.users
    users.sort(function(a, b) {
      return b.num_leave - a.num_leave
    })
    this.setData({
      users: users,
      selectedSort: 1
    })
    this.showUSer()
  },
  sortByAbsent() {
    let users = this.data.users
    users.sort(function(a, b) {
      return b.num_absent - a.num_absent
    })
    this.setData({
      users: users,
      selectedSort: 2
    })
    this.showUSer()
  },
  sortByNotAbsent() {
    let users = this.data.users
    users.sort(function(a, b) {
      return a.num_absent - b.num_absent
    })
    this.setData({
      users: users,
      selectedSort: 3
    })
    this.showUSer()
  },
})