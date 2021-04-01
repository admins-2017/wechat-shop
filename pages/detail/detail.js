import { ShoppingWay } from '../../core/enum';
// pages/detail/detail.js
import {Spu} from '../../model/spu'
import { SaleExplain } from '../../model/sale-explain';
import { Cart } from '../../model/cart';
import { CartItem } from '../../model/cart-item';


Page({

  data: {
    showRealm:false,
    explain:Array,
    cartItemCount:0,
    orderWay:null
  },

  addToCart(event){
    console.log("执行addToCart")
    this.setData({
      showRealm:true,
      orderWay:ShoppingWay.CART
    })
    console.log(this.data.orderWay);
    console.log(this.data.showRealm);

  },

  onBuy(event){
    this.setData({
      showRealm:true,
      orderWay:ShoppingWay.BUY
    })
  },

  goHome(event){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  goCart(event){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取跳转传递的值 spuId
    const spuId = options.spuId;
    // 获取商品详情
    const spu = await Spu.getDetail(spuId)
    const explain = await SaleExplain.getFixed()
    this.setData({
      spu,
      explain
    })
    this.updateCartItemCount()
  },

  onChangeSpec(event){
    this.setData({
      noSpec:event.detail.noSpec,
      skuIntact: event.detail.skuIntact,
      missingKeys: event.detail.missingKeys,
      currentValues:event.detail.currentValues      
    })
  },

  onShopping(event){
    console.log("执行onShopping")
    const sku = event.detail.sku;
    const count = event.detail.skuCount;
    // 判断是否做添加购物车操作
    if(event.detail.orderWay == ShoppingWay.CART){
      const cart = new Cart()
      const cartItem = new CartItem(sku,count)
      cart.addItem(cartItem)
      this.updateCartItemCount()
    }

  },

  updateCartItemCount(){
    const cart = new Cart()
    this.setData({
      cartItemCount:cart.getCartItemCount(),
      showRealm:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})