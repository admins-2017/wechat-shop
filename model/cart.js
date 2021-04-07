/**
 * 购物车实体类
 */

import { Sku } from "./sku";

class Cart {
  // 最小购买数量
  static SKU_MIN_COUNT=1;
  // 最大购买数量
  static SKU_MAX_COUNT=99;
  // 加入购物车的所有商品的 item 最大数量
  static CART_ITEM_MAX_COUNT = 99;
  // 缓存key的那么
  static STORAGE_KEY = 'cart'
  _cartData = null;

  constructor(){
    // 保证购物车是单例模式 Cart.instance 如果为object 说明已被实例化 不需要重新实例化
    if(typeof Cart.instance === 'object'){
      return Cart.instance
    }
    Cart.instance = this 
    return this 
  }

  // 获取本地缓存购物车下所有的商品规格及数量
  getAllCartItemFromLocal(){
    return this._getCartData()
  }

  // 添加商品到购物车
  addItem(newItem){
    if(this.beyondMaxCartItemCount()){
      throw new Error('超过购物车最大数量')
    }
    this._pushItem(newItem)
    this._refreshStorage(newItem);
  }



  // 将购物车的商品删除
  removeItem(skuId){
    // 获取到商品在购物车数组中的角标
    const oldItemIndex = this._findEqualItemIndex(skuId)
    // 获取购物车数组
    const cartData = this._getCartData()
    // 将商品移除
    cartData.items.splice(oldItemIndex,1)
    // 刷新缓存
    this._refreshStorage()
  }

  _findEqualItemIndex(skuId){
    const cartData = this._getCartData()
    return cartData.items.findIndex(item=>{
      return item.skuId === skuId
    })
  }

  // 刷新缓存
  _refreshStorage(){
    wx.setStorageSync(Cart.STORAGE_KEY,this._cartData)
  }

  // 添加item到购物车中
  _pushItem(newItem){
    // 获取购物车原有的item 再将新的item添加到购物车中
    const cartData = this._getCartData()
    // 同一商品的sku不能重复出现
    const oldItem = this.findEqualItem(newItem.skuId)
    // 判断是否有相同的sku
    if(!oldItem){
      // 不存在相同的sku
      cartData.items.unshift(newItem)
    }else{
      // 存在相同的sku
      this._combineItems(oldItem,newItem)
    }
  }

  // 根据id查找item
  findEqualItem(skuId){
    let oldItem = null 
    const items = this._getCartData().items 
    for(let i = 0 ; i <items.length ; i++){
      if(this._isEqualtItem(items[i],skuId)){
        oldItem = items[i]
        break
      }
    }
    return oldItem
  }

  // 判断skuId 是否相等
  _isEqualtItem(oldItem , skuId){
    return oldItem.skuId === skuId
  }

  _combineItems(oldItem,newItem){
    this._plusCount(oldItem,newItem.count)
  }

  _plusCount(items,count){
    // 将商品相同的sku数量累加
    items.count += count 
    // 判断是否超过商品购买最大值
    if(items.count >= Cart.SKU_MAX_COUNT){
      // 如果超过就为最大值
      items.count = Cart.SKU_MAX_COUNT
    }
  }

  // 获取购物车所有数据
  _getCartData(){
    if(this._cartData !== null){
      return this._cartData
    }
    // 如果没有数据则从缓存中获取
    let cartData = wx.getStorageSync(Cart.STORAGE_KEY);
    // 判断是否存在缓存
    if(!cartData){
      cartData = this._initCartDataStorage()
    }
    this._cartData = cartData
    return cartData
  }

  // 初始化缓存数据
  _initCartDataStorage(){
    const cartData = { items:[] }
    wx.setStorageSync(Cart.STORAGE_KEY, cartData)
    return cartData
  }

  // 判断购物车的所有商品是否达到最大数量
  beyondMaxCartItemCount(){
    const cartData = this._getCartData();
    return cartData.items.length >= Cart.CART_ITEM_MAX_COUNT
  }

  isEmpty(){
    const cartData = this._getCartData()
    return cartData.items.length === 0
  }

  getCartItemCount(){
    return this._getCartData().items.length
  }

  // 判断是否售罄
  static isSoldOut(item){
    return item.sku.stock === 0;
  }

  // 判断是否上架
  static isOnline(item){
    return item.sku.online;
  }

  // 更新checkbox状态
  checkItem(skuId){
    const oldItem = this.findEqualItem(skuId)
    oldItem.checked = !oldItem.checked
    this._refreshStorage()
  }

  // 判断所有item是否选中
  isAllChecked(){
    let allChecked = true
    // 获取购物车所有item
    const items = this._getCartData().items;
    // 遍历判断item 是否为未选择
    for(let item of items){
      // 如果未选中
      if(!item.checked){
        allChecked = false
        break
      }
    }
    return allChecked 
  }

  // 全选或取消全选
  checkAll(checked){
    const cartData = this._getCartData()
    // 将所有item状态改为选中 或者未选中
    cartData.items.forEach(item => {
      item.checked = checked
    });
    this._refreshStorage()
  }

  // 获取所有被选中的item
  getCheckedItems(){
    // 获取所有的item
    const cartItems = this._getCartData().items
    const checkedCartItems = []
    // 遍历items获取所有选中的item
    cartItems.forEach(item => {
      if(item.checked){
        // 添加到新数组
        checkedCartItems.push(item)
      }
    });
    return checkedCartItems
  }

  /**
   * 更新count组件数量
   * @param {*} skuId 商品规格id
   * @param {*} newCount 新的数量
   */
  replaceItemCount(skuId , newCount){
    // 根据id获取item
    const oldItem = this.findEqualItem(skuId)
    // 判断item是否存在
    if(!oldItem){
      console.error("异常情况，更新item中的数量不应该找不到")
      return
    }
    // 判断新的数量是否小于1
    if(newCount < 1){
      console.error("异常情况，item中的数量不应该小于1")
      return
    }
    // 将新的数量赋值给item
    oldItem.count = newCount
    // 判断是否超过最大数量
    if(oldItem.count >= Cart.SKU_MAX_COUNT){
      oldItem.count = Cart.SKU_MAX_COUNT
    }
    this._refreshStorage()
  }

  /**
   * 从服务器加载最新的数据
   */
  async getAllSkuFromServer(){
    const cartData = this._getCartData()
    if(cartData.items.length === 0){
      return null
    }
    // 获取所有的skuid
    const skuIds = this.getSkuIds()
    const serverData =await Sku.getSkuByIds(skuIds)
    this._refreshByServerData(serverData)
    this._refreshStorage()
    return this._getCartData()
  }

  // 更新数据 从服务器请求的最新数据替换掉原始缓存的数据
  _refreshByServerData(serverData){
    const cartData = this._getCartData()
    cartData.items.forEach(item => {
      this._setLatestCartItem(item,serverData)
    })
  }

  /**
   * 替换缓存数据
   * @param {*} item 缓存中的item
   * @param {*} serverData 最新的所有item数据
   */
  _setLatestCartItem(item,serverData){
    let removed = true 
    // 遍历最新数据 
    for(let sku of serverData){
      if(sku.id === item.skuId){
        removed = false
        item.sku = sku
        break
      }
    }
    // 如果未匹配到缓存中的item 说明商品下架
    if(removed){
      item.sku.online = false
    } 
  }
  
  // 获取缓存中所有的item的skuid
  getSkuIds(){
    const cartData = this._getCartData()
    // 如果items为空 直接返回空数组
    if(cartData.items.length === 0){
      return []
    }
    // 遍历items 取出id组成新的数组
    return cartData.items.map(item => item.sku.id)
  }

  // 获取缓存中所有选中的item的skuid
  getCheckedSkuIds(){
    const cartData = this._getCartData()
    if(cartData.items.length === 0){
      return []
    }
    const skuIds = []
    cartData.items.forEach(item =>{
      // 判断是否选中
      if(item.checked){
        skuIds.push(item.sku.id)
      }
    })
    return skuIds
  }

  /**
   * 将选中的商品删除
   */
  removeCheckedItems() {
    const cartData = this._getCartData()
    // 遍历购物车
    for (let i = 0; i < cartData.items.length; i++) {
      // 如果选中 则移除
        if (cartData.items[i].checked) {
            cartData.items.splice(i, 1)
        }
    }
    this._refreshStorage()
}

  // 根据sku id 获取到用户选择的sku 数量
  getSkuCountBySkuId(skuId){
    const cartData  = this._getCartData()
    const item = cartData.items.find(item=>item.skuId === skuId)
    if(!item){
      console.error("在订单中未找到对应的商品详情")
    }
    return item.count
  }
}

export{
  Cart
}