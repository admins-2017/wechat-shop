// components/hot-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerList:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftItem:null,
    rightTopItem:null,
    rightBottomItem:null
  },

  // 监听器 可以监听多个属性
  observers:{
    // 'bannerList' 标示监听 bannerList 属性
    // 参数bannerList 和 组件属性中的bannerList是一样的 表示监听结果
    // 'bannerList','theme':function(bannerList,theme){ 监听多个属性 
    'bannerList':function(bannerList){
      // 如果bannerList不存在 则不做处理
      if(!bannerList){
        return
      }
      // 如果bannerList 中 items的长度为0 不需要做数据处理 直接返回
      if(bannerList.items.length === 0){
        return
      }
      // 过滤数据
      const leftItem = bannerList.items.find(item => item.name === 'left');
      const rightTopItem= bannerList.items.find(item => item.name === 'right-top');
      const rightBottomItem= bannerList.items.find(item => item.name === 'right-bottom');
      
      this.setData({
        leftItem,
        rightTopItem,
        rightBottomItem
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeft(event){
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${this.data.leftItem.keyword}`,
      })
    },

    onRightTop(event){
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${this.data.rightTopItem.keyword}`,
      })
    },

    onRightBottom(event){
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${this.data.rightTopItem.keyword}`,
      })
    }
  }
})
