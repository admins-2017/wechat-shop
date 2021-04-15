// components/theme-janna/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:null,
    spuList:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    titles:[],
  },
 
  observers:{
    data: function(data){
      // const spuList = data.spu_list
      const title = data.description
      const titles = title.split('#')
      this.setData({
        // spuList,
        titles
      })      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(event){
      const spuId = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${spuId}`,
      })
    }
  }
})
