// components/spu-preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags:Array 
  },

  observers:{
    data:function(data){
      if(!data){ //如果数据不存在
        return 
      }
      if(!data.tags){ //如果标签不存在
        return
      }
      const tags = data.tags.split('$')
      this.setData({
        tags
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取图片的宽高 动态计算宽高比
    onImage(event){
      const {width , height} = event.detail;
      this.setData({
        w: 340, //宽
        h: 340 * height / width //高
      })
    },
    
    onItemTap(event){
      // 获取view上绑定的data-spu-id中的spuId
      const spuId =event.currentTarget.dataset.spuId;
      // 跳转页面detail
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${spuId}`,
      })
    }
  }
})
