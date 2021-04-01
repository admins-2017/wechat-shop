import { Caculator } from '../../model/caculator';
import {Cart} from '../../model/cart'
const cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 所有sku数组
    cartItems:[],
    isEmpty:false,
    allChecked: false,
    totalPrice:0,
    totalSkuCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const cartData = await cart.getAllSkuFromServer()
    this.setData({
      cartItems:cartData.items
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const cartItems = cart.getAllCartItemFromLocal().items;
    // 判断购物车是否为空空
    if(cart.isEmpty()){
      this.empty()
      return
    }
    this.setData({
      cartItems:cartItems
    })
    this.notEmpty()
    this.isAllChecked()
    this.refreshCartData()
  },

  // 计算所有选中的商品价格
  refreshCartData(){
    const cartItems = cart.getCheckedItems()
    const calculator = new Caculator(cartItems)
    calculator.calc()
    this.setCalcData(calculator)
  },

  // 绑定计算过的数据
  setCalcData(calculator){
    const totalPrice = calculator.getTotalPrice()
    const totalSkuCount = calculator.getTotalSkuCount()
    this.setData({
      totalPrice,
      totalSkuCount
    })
  },

  // 如果缓存数据为空
  empty(){
    this.setData({
      isEmpty:true
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },

  // 缓存数据不为空 
  notEmpty(){
    this.setData({
      isEmpty:false
    })
    wx.showTabBarRedDot({
      index: 2,
    })
  },

  // 判断所有item是否选中
  isAllChecked(){
    const allChecked = cart.isAllChecked()
      this.setData({
        allChecked
      })
  },
  // 监听删除item事件
  onDeleteItem(event){
    this.isAllChecked()
    this.refreshCartData()
  },
  // 监听item 中 checkbox状态改变事件
  onSingleCheck(event){
    this.isAllChecked()
    this.refreshCartData()
  },
  // 监听全选事件
  onCheckAll(event){
    const checked = event.detail.checked
    cart.checkAll(checked)
    this.setData({
      cartItems: this.data.cartItems
    })
    this.refreshCartData()
  },
  // 监听数量改变后由cart-item 传递的事件
  onCountfloat(event){
    this.refreshCartData()
  },

  onSelect(event){
    // 判断用户是否选了购买的商品
    if(this.data.totalSkuCount <= 0){
      return
    }
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
})