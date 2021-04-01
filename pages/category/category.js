const { CategoryDetail } = require("../../model/category-detail");
const { getSystemSize } = require("../../utils/system")
const {SpuListType} = require("../../core/enum")

// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainHeight:Number,
    categoryDetail:Object,
    defaultRootId:2 //默认的root id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // 获取用户手机参数信息
    // const res = await getSystemSize();
    // 动态计算高度
    // const height = (res.windowHeight *2) - 60- 22
    // console.log((res.windowHeight *2))
    // console.log(height)
    // this.setData({
    //   mainHeight:height
    // })
    this.initCategoryData()
  },

  // 初始化分类数据
  async initCategoryData(){
    const categoryDetail = new CategoryDetail()
    this.data.categoryDetail = categoryDetail
    await categoryDetail.getAll();
    // 获取所有的一级分类
    const roots = categoryDetail.getRoots();
    const defaultRoot = this.getDefaultRoot(roots);
    // 获取当前roots的二级分类
    const currentSubs = categoryDetail.getSubs(defaultRoot.id);
    this.setData({
      roots,
      currentSubs,
      currentBannerImg:defaultRoot.img
    })
  },


  // 获取默认root
  getDefaultRoot(roots){
    let defaultRoot = roots.find(r=>r.id === this.data.defaultRootId)
    // 如果没有默认的root 第一个root则为默认root
    if(!defaultRoot){
      defaultRoot = roots[0]
    }
    return defaultRoot
  },

  // 获取用户改变分类事件 
  onChange(event){
    const rootId = event.detail.activeKey
    const root = this.data.categoryDetail.getRoot(rootId)
    const subs = this.data.categoryDetail.getSubs(rootId)
    this.setData({
      currentSubs:subs,
      currentBannerImg:root.img
    })

  },

  onGoToSearch(event){
    wx.navigateTo({
      url: '../search/search',
    })
  },

  onGoToSpuList(event){
    const cid = event.detail.cid
    wx.navigateTo({
      url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})