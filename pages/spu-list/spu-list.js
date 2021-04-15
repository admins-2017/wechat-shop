import {SpuListType} from '../../core/enum'
import { Spu } from '../../model/spu';
import { SpuPaging } from '../../model/spu-paging';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spuList:null,
    spuPading:null,
    loadingType: 'loading',
    show:true,
    loadmore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const cid = options.cid;
    const type = options.type
    let isRoot = true
    if(type == SpuListType.SUB_CATEGORY){
      isRoot=false
    }
    
    this.data.spuPading = await SpuPaging.nextPagingByCategory(cid,isRoot);
      const data = await this.data.spuPading.getMoreData();
      // 如果data不存在直接返回 
      if(data.items.length===0){
        this.setData({
          show:false,
          loadmore:false
        })
        return 
      } 
      wx.lin.renderWaterFlow(data.items)

      if(!data.moreData){
        this.setData({
          loadingType: 'end'
        })
      }
  },
})