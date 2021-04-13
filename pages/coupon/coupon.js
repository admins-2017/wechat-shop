const { Activity } = require("../../model/activity")
import { CouponCenterType } from '../../core/enum';
import { Coupon } from '../../model/coupon';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const aName = options.name
        const type = options.type
        const cid = options.cid

        let coupons
        // 判断是否从活动入口进入
        if (type === CouponCenterType.ACTIVITY) {
            const activity = await Activity.getActivityByName(aName)
            coupons = activity.coupons
        }
        // 判断是否从商品详情入口进入
        if (type === CouponCenterType.SPU_CATEGORY) {
            // 获取分类下所有优惠券
            coupons = await Coupon.getCouponsByCategory(cid)
            // 获取所有全场券
            const wholeStoreCoupons = await Coupon.getWholeStoreCoupons()
            // 追加到优惠券中
            coupons = coupons.concat(wholeStoreCoupons)
        }

        this.setData({
            coupons
        });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})