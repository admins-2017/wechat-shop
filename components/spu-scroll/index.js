// components/spu-scroll/index.js
Component({
  /**
   * 定义外部样式类
   */
  externalClasses:['k-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    theme:{
      type:Object,
      value:{}
    },
    spu_list:{
      type:Array,
      value: []
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
    onItemTap(event){
      const spuId = event.currentTarget.dataset.spuId
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${spuId}`,
      })
    }
  }
})
