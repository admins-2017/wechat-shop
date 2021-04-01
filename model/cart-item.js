// 购物车每个商品详情对应的实体类

class CartItem{ 
  skuId = null  //商品规格id 
  count = 0     //添加数量
  sku = null    //规格
  checked = true 

  constructor(sku , count){
    this.skuId = sku.id;
    this.sku = sku;
    this.count = count;
  }
}

export {
  CartItem
}