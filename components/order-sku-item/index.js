// components/order-sku-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses:['my-class'],
  properties: {
    orderItem:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    specValuesText:null
  },
  observers:{
    'orderItem':function(orderItem){
      console.log("aaaa")
      console.log(orderItem)
      const specValues  = orderItem.spec_values
      this.setData({
        // specValuesText:specValues?
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
