const { Theme } = require("../../model/theme")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme:null,
    spuList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    console.log(options.name)
    const theme = new Theme();
    const themeDetail = await theme.getSpuByTheme(options.name)
    const spuList = themeDetail.spu_list
    this.setData({
      theme:themeDetail,
      spuList
    })
  }

 
})