import { SpuListType } from '../../core/enum'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    grids: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  observers:{
    grids:function(grids){
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goCategoryByRoot(event){
      const categoryId = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/spu-list/spu-list?cid=${categoryId}&type=${SpuListType.ROOT_CATEGORY}`,
      })
    }
  },
});
