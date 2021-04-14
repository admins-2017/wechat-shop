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
    console.log(banner)
    const items = banner.items 
    this.setData({
      banner,
      items
    })
  },

})