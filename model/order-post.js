/**
 * 订单提交实体类
 */
class OrderPost {
  total_price //订单价格
  final_total_price //订单最终价格
  coupon_id //优惠券id
  sku_info_list = [] //购买sku的信息集合
  address = {} //用户地址

  constructor(totalPrice, finalTotalPrice, couponId, skuInfoList, address) {
      this.total_price = totalPrice
      this.final_total_price = finalTotalPrice
      this.coupon_id = couponId
      this.sku_info_list = skuInfoList
      this._fillAddress(address)
  }

  /**
   * 将微信地址转换
   * @param {*} address 微信地址 
   */
  _fillAddress(address) {
      this.address.user_name = address.userName
      this.address.national_code = address.nationalCode
      this.address.postal_code = address.postalCode
      this.address.city = address.cityName
      this.address.province = address.provinceName
      this.address.county = address.countyName
      this.address.detail = address.detailInfo
      this.address.mobile = address.telNumber
  }
}

export {
  OrderPost
}