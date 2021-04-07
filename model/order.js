import {OrderException} from "../core/order-exception";
import {OrderExceptionType, OrderStatus} from "../core/enum";
import {accAdd} from "../utils/number";
import {Http} from "../utils/http";
import {Paging} from "../utils/paging";

class Order {
  orderItems
  localItemCount

  constructor(orderItems,localItemCount){
    this.orderItems = orderItems
    this.localItemCount =localItemCount
  }

  checkOrderIsOk() {
    // 检验 订单项 
    this.orderItems.forEach(item => {
        item.isOk()
    })    
  }

  // 检验订单
  _orderIsOk() {
    // 校验订单是否为空
    this._emptyOrder()
     // 校验订单是否有下架商品
    this._containNotOnSaleItem()
  }

  _emptyOrder() {
    if (this.orderItems.length === 0) {
        throw new OrderException('订单中没有任何商品', OrderExceptionType.EMPTY)
    }
  }

  /**
   * 提交订单到服务器
   * @param {*} orderPost 
   */
  static async postOrderToServer(orderPost) {
    return await Http.request({
        url: '/order',
        method: 'POST',
        data: orderPost,
        throwError: true
    })
  }
 
  _containNotOnSaleItem() {
    if (this.orderItems.length !== this.localItemCount) {
        throw new OrderException('服务器返回订单商品数量与实际不相符，可能是有商品已下架', OrderExceptionType.NOT_ON_SALE)
    }
  }
/**
 * 获取总价
 */
  getTotalPrice() {
    return this.orderItems.reduce((pre, item) => {
        const price = accAdd(pre, item.finalPrice)
        return price
    }, 0)
}

/**
 * 获取订单所有商品信息
 */
getOrderSkuInfoList() {
  return this.orderItems.map(item => {
      return {
          id: item.skuId, //sku id
          count: item.count //购买数量
      }
  })
}

/**
 * 获取优惠券适用的分类在订单中的总价格
 * @param {*} categoryIdList 
 */
getTotalPriceByCategoryIdList(categoryIdList) {
  console.log(categoryIdList)
    if (categoryIdList.length === 0) {
        return 0
    }
    // reduce 遍历分类id累加优惠券适用的分类下商品总价格
    const price = categoryIdList.reduce((pre, cur) => {
        const eachPrice = this.getTotalPriceEachCategory(cur)
        return accAdd(pre, eachPrice)
    }, 0);
    return price
}

/**
 * 计算订单中单个分类下商品的价格
 * @param {*} categoryId 分类id
 */
getTotalPriceEachCategory(categoryId) {
    const price = this.orderItems.reduce((pre, orderItem) => {

        const itemCategoryId = this._isItemInCategories(orderItem, categoryId)
        if (itemCategoryId) {
            return accAdd(pre, orderItem.finalPrice)
        }
        return pre
    }, 0)
    return price
}

/**
 * 判断商品是否属于当前分类
 * @param {*} orderItem 订单商品
 * @param {*} categoryId 分类id
 */
_isItemInCategories(orderItem, categoryId) {
  if (orderItem.categoryId === categoryId) {
      return true
  }
  if (orderItem.rootCategoryId === categoryId) {
      return true
  }
  return false
}
}

export{
  Order
}