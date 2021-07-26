// components/DiscoveryCheckinCard/DiscoveryCheckinCard.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    distance :{
      type:Number
    },
    name:{
      type: String
    },
    username:{
      type: String
    },
    numshould:{
      type: Number
    },
    numactual: {
      type: Number
    },
    numleave: {
      type: Number
    },
    numabsent: {
      type: Number
    },
    type:{
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    intDistance:0
  },
  /**
   * onAttach
   */
  attached:function(){
    this.setData({ intDistance: Math.round(this.properties.distance)})
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
