/**
 * 计算器实体类
 */
class Caculator{
  // 总金额
  totalPrice = 0
  // 总数量
  totalSkuCount = 0

  cartItems = []

  constructor(cartItems){
    this.cartItems = cartItems
  }

  // 初始化
  calc(){
    this.cartItems.forEach(item => {
      this.push(item)
    })
  }

  getTotalPrice(){
    return this.totalPrice
  }

  getTotalSkuCount(){
    return this.totalSkuCount
  }

  push(item){
    let partTotalPrice = 0
    // 判断当前商品是否存在折扣价
    if(item.sku.discount_price){
      partTotalPrice = item.count * item.sku.discount_price
    }else{
      partTotalPrice = item.count * item.sku.price
    }
    // 累加金额
    this.totalPrice += partTotalPrice
    this.totalSkuCount += item.count
  }
}

export{
  Caculator
}