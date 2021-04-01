import { Cart } from "./cart"
import { accMultiply } from '../utils/number'
import {OrderExceptionType} from '../core/enum'
import {OrderException} from '../core/order-exception'

class OrderItem {
  count = 0 //数量
  singleFinalPrice //商品单价
  finalPrice //商品总价
  online //状态是否上架
  title
  img
  stock //库存
  categoryId //一级分类
  rootCategoryId //二级分类
  specs //规格
  skuId
  cart = new Cart()

  constructor(sku, count) {
    this.title = sku.title
    this.img = sku.img
    this.skuId = sku.id
    this.stock = sku.stock
    this.online = sku.online
    this.categoryId = sku.category_id
    this.rootCategoryId = sku.root_catgory_id
    this.specs = sku.specs
    this.count = count
    this.singleFinalPrice = this.ensureSingleFinalPrice(sku)
    this.finalPrice = accMultiply(this.count, this.singleFinalPrice)
  }

  // 计算单价是否存在折扣价格
  ensureSingleFinalPrice(sku) {
    if (sku.discount_price) {
      return sku.discount_price
    }
    return sku.price
  }

  // 校验数据
  isOk() {
    this._checkStock()
    this._beyondMaxSkuCount()
  }

  // 校验库存是否足够
  _checkStock() {
    if (this.stock === 0) {
      throw new OrderException('当前商品已售罄', OrderExceptionType.SOLD_OUT)
    }
    if (this.count > this.stock) {
      throw new OrderException('购买商品数量超过最大库存', OrderExceptionType.BEYOND_STOCK)
    }
  }

  // 校验购买数量是否超过最大购买数量
  _beyondMaxSkuCount() {
    if (this.count > Cart.SKU_MAX_COUNT) {
      throw new OrderException('超过商品最大购买数量', OrderExceptionType.BEYOND_SKU_MAX_COUNT)
    }
  }
}



export {
  OrderItem
}