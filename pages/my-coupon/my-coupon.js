import {CouponStatus} from "../../core/enum";
import { Coupon } from "../../model/coupon"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认选中的key
    activeKey:CouponStatus.AVAILABLE,
    // 数据
    items:[],
    loadingType:'loading',
    bottomLoading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.key!=null){
      this.data.activeKey = options.key
      this.initItems(this.data.activeKey)
    }
    this.initItems(this.data.activeKey)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initItems(this.data.activeKey)
  },
  
  /**
   * 初始化数据
   * @param {*} activeKey 
   */
  async initItems(activeKey) {
    wx.lin.hideEmpty()
    this.setData({
        activeKey,
        items:[]
    })
    activeKey = parseInt(activeKey)
    const data = await Coupon.getMyCoupons(activeKey)
    if(!data){
        return
    }
    this.bindItems(data)
    this.setData({
      bottomLoading:false
  })
  },

  bindItems(data) {

    if (data.length !== 0){
        this.setData({
            items:data,
            bottomLoading:true
        });
    }
    
  },

  onSegmentChange(event){
    const activeKey = event.detail.activeKey
    this.initItems(activeKey)
  },

  onShopping(event){

  }

})