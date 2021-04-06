// pages/order/order.js
import {Cart} from '../../model/cart'
import { Order } from '../../model/order'
import { OrderItem } from '../../model/order-item'
import {Sku} from '../../model/sku'
import { Coupon } from '../../model/coupon'
import { CouponBO } from '../../model/coupon-bo'
const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOk: true,
    order: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let orderItems
    let localItemCount
    // 获取缓存中所有选中的item的skuid
    const skuIds = cart.getCheckedSkuIds()
    console.log('skuIds')
    console.log(skuIds)
    orderItems = await this.getCartOrderItems(skuIds)
    localItemCount = skuIds.length

    const order = new Order(orderItems,localItemCount)
    // this.data.order = order
    try{
      order.checkOrderIsOk()
    }catch(e){
      this.setData({
        isOk: false
      })
      return
    }
    const coupons = await Coupon.getMySelfWithCategory()
    const couponList = this.packageCouponBOList(coupons,order)
    this.setData({
      couponList,
      orderItems
    })
  },

  // 根据skuid 获取item属性
  async getCartOrderItems(skuIds){
    // 同步最新的sku数据
   const skus = await Sku.getSkuByIds(skuIds);
   const orderItems = this.packageOrderItems(skus)
   return orderItems
  },

  // 将服务器返回最新的商品信息和用户选择的数量实例化到orderItem对象中
  packageOrderItems(skus){
    return skus.map(sku => {
      const count = cart.getSkuCountBySkuId(sku.id)
      return new OrderItem(sku,count)
    })
  },
  /**
   * 将优惠券结果封装
   * @param {*}} coupons 
   * @param {*} order 
   */
  packageCouponBOList(coupons, order) {
    return coupons.map(coupon => {
        const couponBO = new CouponBO(coupon)
        // couponBO.meetCondition(order)
        return couponBO
    })
}
})