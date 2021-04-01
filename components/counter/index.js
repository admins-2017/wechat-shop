const { Cart } = require("../../model/cart");

// components/counter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count:{
      type:Number,
      value:Cart.SKU_MIN_COUNT
    },
    min:{
      type:Number,
      value:Cart.SKU_MIN_COUNT
    },
    max:{
      type:Number,
      value:Cart.SKU_MAX_COUNT
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 数字超出可选范围触发的事件
    onOverStep(event){
      // 获取事件名称 overflow_max 超出最大值 overflow_min 超出最小值
      const minOrMax = event.detail.type
      if(minOrMax == 'overflow_max'){
        wx.showToast({
          icon:'none',
          duration:3000,
          title: '超出最大购买数量',
        })
      }
      if(minOrMax == 'overflow_min'){
        wx.showToast({
          icon:'none',
          duration:3000,
          title: `最少需要购买${Cart.SKU_MIN_COUNT}件`,
        })
      }
    }
  }
})
