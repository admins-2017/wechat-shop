/** 枚举类 */

const CellStatus= {
  FORBIDDEN: 'forbidden',
  SELECTED: 'selected',
  WAITING: 'waiting'
}

const ShoppingWay={
  CART:'cart',
  BUY:'buy'
}

const SpuListType={
  SUB_CATEGORY:'sub_category',
  ROOT_CATEGORY:'root_category',
  THEME:'theme',
  LATEST:'latest'

}

const OrderExceptionType = {
  BEYOND_STOCK: 'beyond_stock',
  BEYOND_SKU_MAX_COUNT: 'beyond_sku_max_count',
  BEYOND_ITEM_MAX_COUNT: 'beyond_item_max_count',
  SOLD_OUT: 'sold_out',
  NOT_ON_SALE: 'not_on_sale',
  EMPTY: 'empty'
}

const CouponCenterType = {
    // 活动入口进入优惠券页面
  ACTIVITY: 'activity',
    // 商品详情入口进入优惠券页面
  SPU_CATEGORY: 'spu_category'
}


const CouponStatus = {
  CAN_COLLECT: 0,
  AVAILABLE: 1,
  USED: 2,
  EXPIRED: 3
}


/**
 * 优惠券选中状态
 */
const CouponOperate = {
  PICK: 'pick',
  UNPICK: 'unpick'
}


export{
  CellStatus,
  ShoppingWay,
  SpuListType,
  OrderExceptionType,
  CouponCenterType,
  CouponStatus,
  CouponOperate
}