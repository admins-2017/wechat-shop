const { Banner } = require("../../model/banner")

// pages/banner/banner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:null,
    items:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const banner = await Banner.getHomeLocationGBanner();
    const items = banner.items 
    this.setData({
      banner,
      items
    })
  },

  goDetail(event){
    const spuId = event.currentTarget.dataset.keyword
    wx.navigateTo({
      url: `/pages/detail/detail?spuId=${spuId}`,
    })
  }

})