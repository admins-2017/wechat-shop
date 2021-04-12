// pages/order/order.js
import {Cart} from '../../model/cart'
import { Order } from '../../model/order'
import { OrderItem } from '../../model/order-item'
import {Sku} from '../../model/sku'
import { Coupon } from '../../model/coupon'
import { CouponBO } from '../../model/coupon-bo'
import {CouponOperate, ShoppingWay} from "../../core/enum";
import { OrderPost } from "../../model/order-post"
import { Payment } from "../../model/payment" 
const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOk: true,
    order: null ,
    finalTotalPrice: 0, //最终价格
    totalPrice: 0, //总价格
    discountMoney: 0, //优惠金额
    currentCouponId: null,
    address: null,
    submitBtnDisable: false,

    orderFail: false,
    orderFailMsg: '',

    shoppingWay: ShoppingWay.BUY
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let orderItems
    let localItemCount

    const shoppingWay = options.way
    this.data.shoppingWay = shoppingWay
    
    // 判断是立即购买下单还是购物车页面下单
    if (shoppingWay === ShoppingWay.BUY) {
      const skuId = options.sku_id
      const count = options.count
      orderItems = await this.getSingleOrderItems(skuId, count)
      localItemCount = 1
  } else {
      // 获取缓存中所有选中的item的skuid
      const skuIds = cart.getCheckedSkuIds()
      // 获取购物车选中的商品规格id
      orderItems = await this.getCartOrderItems(skuIds)
      localItemCount = skuIds.length
  }

    const order = new Order(orderItems,localItemCount)
    this.data.order = order
    try{
      order.checkOrderIsOk()
    }catch(e){
      this.setData({
        isOk: false
      })
      return
    }
    // 根据分类获取我的优惠券
    const coupons = await Coupon.getMySelfWithCategory()
    const couponList = this.packageCouponBOList(coupons,order)
    console.log(couponList)
    this.setData({
      couponList,
      orderItems,
      totalPrice: order.getTotalPrice(),
      finalTotalPrice: order.getTotalPrice()
    })
  },

  // 根据skuid 获取item属性
  async getCartOrderItems(skuIds){
    // 同步最新的sku数据
   const skus = await Sku.getSkuByIds(skuIds);
   const orderItems = this.packageOrderItems(skus)
   return orderItems
  },

  /**
   * 同步数据并转换为orderItem对象
   * @param {*} skuId 
   * @param {*} count 
   */
  async getSingleOrderItems(skuId, count) {
    const skus = await Sku.getSkuByIds(skuId)
    return [new OrderItem(skus[0], count)];
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
        couponBO.meetCondition(order)
        return couponBO
    })
  },

  /**
   * 提交订单
   * @param {*} event 
   */
  async onSubmit(event) {
    if (!this.data.address) {
        showToast('请选择收获地址')
        return
    }
    // 将按钮禁用
    this.disableSubmitBtn()
    // 获取订单数据
    const order = this.data.order
    const orderPost = new OrderPost(
        this.data.totalPrice,
        this.data.finalTotalPrice,
        this.data.currentCouponId,
        order.getOrderSkuInfoList(),
        this.data.address
    )
    // 获取服务器返回的订单id
    const oid = await this.postOrder(orderPost)
    // 如果订单id为空
    if (!oid) {
        this.enableSubmitBtn()
        return
    }
    // 如果订单提交成功 删除购物车中已提交的商品
    if (this.data.shoppingWay === ShoppingWay.CART) {
        console.log("执行删除")
        cart.removeCheckedItems()
    }

    // 支付 小程序/前端 支付
    // 支付参数 调用 API
    // 支付 wx.requestPayment(params)
    // API => params
    wx.lin.showLoading({
        type: "flash",
        fullScreen: true,
        color: "#157658"
    })
    // const payParams = await Payment.getPayParams(oid)
    // if (!payParams) {
    //     return
    // }
    // 是否完成支付 未支付或支付失败抛出异常
    try {
        // 支付成功跳转
        // const res = await wx.requestPayment(payParams)
        wx.redirectTo({
            url: `/pages/pay-success/pay-success?oid=${oid}`
        })
    } catch (e) {
      // 支付失败
        wx.redirectTo({
            url: `/pages/my-order/my-order?key=${1}`
        })
    }
    // wx.requestPayment()
  },

  /**
   * 提交订单到服务器
   * @param {*} orderPost 订单信息 
   */
  async postOrder(orderPost) {
    try {
        // 获取订单提交地址
        const serverOrder = await Order.postOrderToServer(orderPost)
        // 获取服务器订单号
        if (serverOrder) {
            return serverOrder.id
        }
        // throwError 捕获异常
    } catch (e) {
        // 处理订单失败 获取code码
        this.setData({
            orderFail: true,
            orderFailMsg: e.message
        })
    }
  },


  /**
   * 禁用按钮 防止反复点击
   */
  disableSubmitBtn() {
    this.setData({
        submitBtnDisable: true
    })
  },

  /**
   * 开启按钮 
   */
  enableSubmitBtn() {
      this.setData({
          submitBtnDisable: false
      })
  },

  /**
   * 获取地址组件中抛出的事件 并将地址保存
   * @param {*} event 
   */
  onChooseAddress(event) {
    const address = event.detail.address
    this.data.address = address
  },

  /**
   * 获取用户选中或取消选中的优惠券 重新计算价格
   * @param {*} event 
   */
  onChooseCoupon(event) {
    // 获取选中或取消的优惠券对象
    const couponObj = event.detail.coupon
    // 获取选中或取消优惠券状态
    const couponOperate = event.detail.operate
    // 选中 重新计算订单价格
    if (couponOperate === CouponOperate.PICK) {
        this.data.currentCouponId = couponObj.id
        const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj)
        this.setData({
            finalTotalPrice: priceObj.finalPrice,
            discountMoney: priceObj.discountMoney
        })
    // 取消选中    
    } else {
        this.data.currentCouponId = null
        this.setData({
            finalTotalPrice: this.data.order.getTotalPrice(),
            discountMoney: 0
        })
    }

  },
})