/**
 * 优惠券二次封装业务对象
 */
import {CouponType} from "../core/enum";
import {accMultiply, accSubtract} from "../utils/number";

class CouponBO {
    constructor(coupon) {
        this.type = coupon.type
        this.fullMoney = coupon.full_money
        this.rate = coupon.rate
        this.minus = coupon.minus
        this.id = coupon.id
        this.startTime = coupon.start_time
        this.endTime = coupon.end_time
        this.wholeStore = coupon.whole_store
        this.title = coupon.title
        this.satisfaction = false
        // 将分类转换为分类id数组
        this.categoryIds = coupon.categories.map(category => {
            return category.id
        })
    }

    /**
     * 计算优惠券是否能在当前订单使用
     * @param {*} order 订单对象 
     */
    meetCondition(order) {
        // 分类总价格
        let categoryTotalPrice;
        if (this.wholeStore) {
            // 全场券无视适用分类
            categoryTotalPrice = order.getTotalPrice()
        } else {
            categoryTotalPrice = order.getTotalPriceByCategoryIdList(this.categoryIds)
        }
        // 判断当前优惠券是否可以使用
        let satisfaction = false

        switch (this.type) {
            // 满减券
            case CouponType.FULL_MINUS:
            case CouponType.FULL_OFF:
                satisfaction = this._fullTypeCouponIsOK(categoryTotalPrice)
                break
            // 无门槛券
            case CouponType.NO_THRESHOLD_MINUS:
                satisfaction = true
                break
            default:
                break
        }
        this.satisfaction = satisfaction
    }

    /**
     * 获取订单最终金额
     * @param {*} orderPrice 订单金额 
     * @param {*} couponObj 优惠券
     */
    static getFinalPrice(orderPrice, couponObj) {
        if (couponObj.satisfaction === false) {
            throw new Error('优惠券不满足使用条件')
        }
        let finalPrice;
        switch (couponObj.type) {
            // 满减金额计算
            case CouponType.FULL_MINUS:
                return {
                    // 订单最终价格 = 订单总金额 - 优惠券满减的金额
                    finalPrice: accSubtract(orderPrice, couponObj.minus),
                    // 优惠金额  =  优惠券满减的金额
                    discountMoney: couponObj.minus
                }
            // 满减折扣计算
            case CouponType.FULL_OFF:
                // 订单最终价格 = 订单总金额 * 优惠券满减的折扣
                const actualPrice = accMultiply(orderPrice, couponObj.rate)
                // 将金额向上取整
                finalPrice = CouponBO.roundMoney(actualPrice)
                // 优惠金额 = 订单金额 - 最终金额
                const discountMoney = accSubtract(orderPrice, finalPrice)
                return {
                    // 最终价格
                    finalPrice,
                    // 优惠价格
                    discountMoney
                }
            // 无门槛计算
            case CouponType.NO_THRESHOLD_MINUS:
                // 最终价格 = 订单价格 - 优惠价格
                finalPrice = accSubtract(orderPrice, couponObj.minus)
                // 如果最终价格小于0 则返回0 反之返回最终价格
                finalPrice = finalPrice < 0 ? 0 : finalPrice
                return {
                    finalPrice,
                    discountMoney: couponObj.minus
                }
        }
    }

    /**
     * 向上取整
     * @param {*} money 
     */
    static roundMoney(money) {
        // 对于小数的约束可能模式有4种：向上/向下取整、四舍五入、银行家模式
        // 前端算法模式必须同服务端保持一致，否则对于浮点数金额的运算将导致订单无法通过验证
        const final = Math.ceil(money * 100) / 100
        return final
    }

    /**
     * 判断当前订单的金额是否够适用优惠券 用于满减券
     * @param {*} categoryTotalPrice 
     */
    _fullTypeCouponIsOK(categoryTotalPrice) {
        if (categoryTotalPrice >= this.fullMoney) {
            return true
        }
        return false
    }
}

export {
    CouponBO
}